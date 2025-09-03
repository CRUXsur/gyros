"""
Unit tests for ADB method.
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
import subprocess
from src.methods.adb_method import ADBMethod
from src.core.device_detector import DeviceInfo


class TestADBMethod(unittest.TestCase):
    """Test cases for ADB method."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.config = {
            "command_timeout": 5,
            "service_call_command": "service call iphonesubinfo 1",
            "alternative_commands": ["service call iphonesubinfo 3"],
            "logging": {"level": "DEBUG", "console_enabled": False, "file_enabled": False}
        }
        self.adb_method = ADBMethod(self.config)
        
        self.android_device = DeviceInfo(
            device_type='android',
            connection_info={
                'device_id': 'test_device_123',
                'status': 'device',
                'adb_path': 'adb'
            }
        )
        
        self.serial_device = DeviceInfo(
            device_type='serial',
            connection_info={'port': '/dev/ttyUSB0'}
        )
    
    def test_is_compatible_android_device(self):
        """Test compatibility with Android device."""
        self.assertTrue(self.adb_method.is_compatible(self.android_device))
    
    def test_is_compatible_serial_device(self):
        """Test incompatibility with serial device."""
        self.assertFalse(self.adb_method.is_compatible(self.serial_device))
    
    def test_get_priority(self):
        """Test method priority."""
        self.assertEqual(self.adb_method.get_priority(), 10)
    
    @patch('subprocess.run')
    def test_test_connection_success(self, mock_run):
        """Test successful connection test."""
        mock_run.return_value = Mock(returncode=0, stdout="test")
        
        result = self.adb_method.test_connection(self.android_device)
        self.assertTrue(result)
        
        mock_run.assert_called_once()
    
    @patch('subprocess.run')
    def test_test_connection_failure(self, mock_run):
        """Test failed connection test."""
        mock_run.return_value = Mock(returncode=1, stdout="")
        
        result = self.adb_method.test_connection(self.android_device)
        self.assertFalse(result)
    
    @patch('subprocess.run')
    def test_read_imei_success(self, mock_run):
        """Test successful IMEI reading."""
        # Mock successful service call response
        mock_run.return_value = Mock(
            returncode=0,
            stdout="Result: Parcel(00000000 '123456789012345' 00000000)"
        )
        
        result = self.adb_method.read_imei(self.android_device)
        
        self.assertTrue(result.success)
        self.assertEqual(result.imei, "123456789012345")
        self.assertIn("ADBMethod", result.method)
    
    @patch('subprocess.run')
    def test_read_imei_command_failure(self, mock_run):
        """Test IMEI reading with command failure."""
        mock_run.return_value = Mock(returncode=1, stderr="Device not found")
        
        result = self.adb_method.read_imei(self.android_device)
        
        self.assertFalse(result.success)
        self.assertIn("ADB command failed", result.error)
    
    @patch('subprocess.run')
    def test_read_imei_timeout(self, mock_run):
        """Test IMEI reading with timeout."""
        mock_run.side_effect = subprocess.TimeoutExpired(['adb'], 5)
        
        result = self.adb_method.read_imei(self.android_device)
        
        self.assertFalse(result.success)
        self.assertIn("timed out", result.error)
    
    def test_parse_service_call_output_quoted(self):
        """Test parsing service call output with quoted IMEI."""
        output = "Result: Parcel(00000000 '123456789012345' 00000000)"
        imei = self.adb_method._parse_service_call_output(output)
        self.assertEqual(imei, "123456789012345")
    
    def test_parse_service_call_output_no_imei(self):
        """Test parsing service call output without IMEI."""
        output = "Result: Parcel(00000000 'invalid' 00000000)"
        imei = self.adb_method._parse_service_call_output(output)
        self.assertIsNone(imei)
    
    def test_parse_dumpsys_output(self):
        """Test parsing dumpsys output."""
        output = "Device ID = 123456789012345\nOther info = value"
        imei = self.adb_method._parse_dumpsys_output(output)
        self.assertEqual(imei, "123456789012345")
    
    def test_incompatible_device(self):
        """Test reading IMEI from incompatible device."""
        result = self.adb_method.read_imei(self.serial_device)
        
        self.assertFalse(result.success)
        self.assertIn("not compatible", result.error)


if __name__ == '__main__':
    unittest.main()
