"""
Unit tests for device detector.
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
from src.core.device_detector import DeviceDetector, DeviceInfo


class TestDeviceDetector(unittest.TestCase):
    """Test cases for device detector."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.config = {
            "scan_interval": 1,
            "timeout": 5,
            "retry_attempts": 2,
            "logging": {"level": "DEBUG", "console_enabled": False, "file_enabled": False}
        }
        self.detector = DeviceDetector(self.config)
    
    @patch('src.core.device_detector.find_adb_executable')
    @patch('subprocess.run')
    def test_detect_android_devices_success(self, mock_run, mock_find_adb):
        """Test successful Android device detection."""
        mock_find_adb.return_value = "adb"
        mock_run.return_value = Mock(
            returncode=0,
            stdout="List of devices attached\ntest_device_123\tdevice\n"
        )
        
        devices = self.detector._detect_android_devices()
        
        self.assertEqual(len(devices), 1)
        self.assertEqual(devices[0].device_type, 'android')
        self.assertEqual(devices[0].connection_info['device_id'], 'test_device_123')
    
    @patch('src.core.device_detector.find_adb_executable')
    def test_detect_android_devices_no_adb(self, mock_find_adb):
        """Test Android device detection when ADB not found."""
        mock_find_adb.return_value = None
        
        devices = self.detector._detect_android_devices()
        
        self.assertEqual(len(devices), 0)
    
    @patch('serial.tools.list_ports.comports')
    def test_detect_serial_devices_success(self, mock_comports):
        """Test successful serial device detection."""
        mock_port = Mock()
        mock_port.device = '/dev/ttyUSB0'
        mock_port.description = 'Android Device'
        mock_port.manufacturer = 'Samsung'
        mock_port.product = 'Galaxy Phone'
        mock_port.vid = 0x04E8  # Samsung VID
        mock_port.pid = 0x1234
        mock_port.serial_number = 'ABC123'
        
        mock_comports.return_value = [mock_port]
        
        devices = self.detector._detect_serial_devices()
        
        self.assertEqual(len(devices), 1)
        self.assertEqual(devices[0].device_type, 'serial')
        self.assertEqual(devices[0].connection_info['port'], '/dev/ttyUSB0')
    
    @patch('serial.tools.list_ports.comports')
    def test_detect_serial_devices_no_mobile(self, mock_comports):
        """Test serial device detection with non-mobile devices."""
        mock_port = Mock()
        mock_port.device = '/dev/ttyUSB0'
        mock_port.description = 'USB Serial Port'
        mock_port.manufacturer = 'Unknown'
        mock_port.product = 'Generic Serial'
        mock_port.vid = 0x1234  # Unknown VID
        mock_port.pid = 0x5678
        
        mock_comports.return_value = [mock_port]
        
        devices = self.detector._detect_serial_devices()
        
        self.assertEqual(len(devices), 0)  # Should not detect non-mobile devices
    
    def test_is_potential_mobile_device_by_description(self):
        """Test mobile device detection by description."""
        mock_port = Mock()
        mock_port.description = 'Android Phone'
        mock_port.manufacturer = 'Unknown'
        mock_port.vid = None
        
        result = self.detector._is_potential_mobile_device(mock_port)
        self.assertTrue(result)
    
    def test_is_potential_mobile_device_by_vid(self):
        """Test mobile device detection by VID."""
        mock_port = Mock()
        mock_port.description = 'USB Device'
        mock_port.manufacturer = 'Unknown'
        mock_port.vid = 0x04E8  # Samsung VID
        
        result = self.detector._is_potential_mobile_device(mock_port)
        self.assertTrue(result)
    
    def test_is_potential_mobile_device_false(self):
        """Test non-mobile device detection."""
        mock_port = Mock()
        mock_port.description = 'Generic USB Device'
        mock_port.manufacturer = 'Generic'
        mock_port.vid = 0x1234  # Unknown VID
        
        result = self.detector._is_potential_mobile_device(mock_port)
        self.assertFalse(result)
    
    @patch.object(DeviceDetector, 'detect_devices')
    def test_get_device_by_type(self, mock_detect):
        """Test getting device by type."""
        mock_device = DeviceInfo('android', {'device_id': 'test'})
        mock_detect.return_value = [mock_device]
        
        result = self.detector.get_device_by_type('android')
        
        self.assertEqual(result, mock_device)
    
    @patch.object(DeviceDetector, 'detect_devices')
    def test_get_device_by_type_not_found(self, mock_detect):
        """Test getting device by type when not found."""
        mock_detect.return_value = []
        
        result = self.detector.get_device_by_type('android')
        
        self.assertIsNone(result)
    
    @patch('time.time')
    @patch.object(DeviceDetector, 'detect_devices')
    def test_wait_for_device_success(self, mock_detect, mock_time):
        """Test successful device waiting."""
        mock_device = DeviceInfo('android', {'device_id': 'test'})
        mock_detect.return_value = [mock_device]
        mock_time.side_effect = [0, 1]  # Start time, check time
        
        result = self.detector.wait_for_device(timeout=5)
        
        self.assertEqual(result, mock_device)
    
    @patch('time.time')
    @patch('time.sleep')
    @patch.object(DeviceDetector, 'detect_devices')
    def test_wait_for_device_timeout(self, mock_detect, mock_sleep, mock_time):
        """Test device waiting timeout."""
        mock_detect.return_value = []
        mock_time.side_effect = [0, 6]  # Start time, timeout exceeded
        
        result = self.detector.wait_for_device(timeout=5)
        
        self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()
