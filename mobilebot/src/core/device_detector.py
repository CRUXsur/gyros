"""
Device detection module for MobileBot IMEI Reader.

This module handles detection and identification of mobile devices
connected via USB ports.
"""

import time
import subprocess
import serial.tools.list_ports
from typing import List, Dict, Optional, Any
from utils.logger import setup_logger
from utils.helpers import find_adb_executable, is_android_device_connected


class DeviceInfo:
    """Information about a detected device."""
    
    def __init__(self, device_type: str, connection_info: Dict[str, Any]):
        """
        Initialize device information.
        
        Args:
            device_type: Type of device ('android', 'serial', 'unknown')
            connection_info: Dictionary with connection details
        """
        self.device_type = device_type
        self.connection_info = connection_info
        self.timestamp = time.time()
    
    def __str__(self) -> str:
        """String representation of device info."""
        return f"DeviceInfo(type={self.device_type}, info={self.connection_info})"
    
    def __repr__(self) -> str:
        """String representation of device info."""
        return self.__str__()


class DeviceDetector:
    """Device detector for mobile devices connected via USB."""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize device detector.
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.logger = setup_logger("DeviceDetector", config.get("logging", {}))
        self.scan_interval = config.get("scan_interval", 2)
        self.timeout = config.get("timeout", 10)
        self.retry_attempts = config.get("retry_attempts", 3)
        
        # Cache for detected devices
        self._detected_devices: List[DeviceInfo] = []
        self._last_scan_time = 0
    
    def detect_devices(self, rescan: bool = False) -> List[DeviceInfo]:
        """
        Detect connected mobile devices.
        
        Args:
            rescan: Force a new scan even if cache is recent
            
        Returns:
            List of detected device information
        """
        current_time = time.time()
        
        # Use cache if recent and not forcing rescan
        if (not rescan and 
            self._detected_devices and 
            current_time - self._last_scan_time < self.scan_interval):
            return self._detected_devices
        
        self.logger.info("Scanning for connected mobile devices...")
        devices = []
        
        # Detect Android devices via ADB
        android_devices = self._detect_android_devices()
        devices.extend(android_devices)
        
        # Detect serial devices
        serial_devices = self._detect_serial_devices()
        devices.extend(serial_devices)
        
        # Update cache
        self._detected_devices = devices
        self._last_scan_time = current_time
        
        self.logger.info(f"Found {len(devices)} device(s)")
        return devices
    
    def _detect_android_devices(self) -> List[DeviceInfo]:
        """
        Detect Android devices via ADB.
        
        Returns:
            List of Android device information
        """
        devices = []
        adb_path = find_adb_executable()
        
        if not adb_path:
            self.logger.debug("ADB not found, skipping Android device detection")
            return devices
        
        try:
            # Run adb devices command
            result = subprocess.run(
                [adb_path, "devices", "-l"],
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')
                for line in lines[1:]:  # Skip header line
                    if line.strip() and 'device' in line:
                        # Parse device line
                        parts = line.strip().split()
                        if len(parts) >= 2:
                            device_id = parts[0]
                            status = parts[1]
                            
                            if status == 'device':
                                device_info = DeviceInfo(
                                    device_type='android',
                                    connection_info={
                                        'device_id': device_id,
                                        'status': status,
                                        'adb_path': adb_path,
                                        'details': ' '.join(parts[2:]) if len(parts) > 2 else ''
                                    }
                                )
                                devices.append(device_info)
                                self.logger.info(f"Found Android device: {device_id}")
        
        except (subprocess.SubprocessError, FileNotFoundError) as e:
            self.logger.warning(f"Error detecting Android devices: {e}")
        
        return devices
    
    def _detect_serial_devices(self) -> List[DeviceInfo]:
        """
        Detect devices via serial ports.
        
        Returns:
            List of serial device information
        """
        devices = []
        
        try:
            # Get all available serial ports
            ports = serial.tools.list_ports.comports()
            
            for port in ports:
                # Check if port might be a mobile device
                if self._is_potential_mobile_device(port):
                    device_info = DeviceInfo(
                        device_type='serial',
                        connection_info={
                            'port': port.device,
                            'description': port.description,
                            'manufacturer': getattr(port, 'manufacturer', 'Unknown'),
                            'product': getattr(port, 'product', 'Unknown'),
                            'vid': getattr(port, 'vid', None),
                            'pid': getattr(port, 'pid', None),
                            'serial_number': getattr(port, 'serial_number', None)
                        }
                    )
                    devices.append(device_info)
                    self.logger.info(f"Found serial device: {port.device} ({port.description})")
        
        except Exception as e:
            self.logger.warning(f"Error detecting serial devices: {e}")
        
        return devices
    
    def _is_potential_mobile_device(self, port) -> bool:
        """
        Check if a serial port might be a mobile device.
        
        Args:
            port: Serial port information
            
        Returns:
            True if port might be a mobile device
        """
        # Check description for mobile device keywords
        description = (port.description or '').lower()
        manufacturer = getattr(port, 'manufacturer', '') or ''
        manufacturer = manufacturer.lower()
        
        mobile_keywords = [
            'mobile', 'phone', 'android', 'iphone', 'samsung', 'huawei',
            'xiaomi', 'lg', 'htc', 'sony', 'motorola', 'nokia', 'oneplus',
            'oppo', 'vivo', 'realme', 'modem', 'qualcomm', 'mediatek'
        ]
        
        # Check if any mobile keywords are in description or manufacturer
        for keyword in mobile_keywords:
            if keyword in description or keyword in manufacturer:
                return True
        
        # Check VID/PID for known mobile device vendors
        known_mobile_vids = [
            0x04E8,  # Samsung
            0x18D1,  # Google
            0x12D1,  # Huawei
            0x2717,  # Xiaomi
            0x1004,  # LG
            0x0BB4,  # HTC
            0x054C,  # Sony
            0x22B8,  # Motorola
            0x0421,  # Nokia
            0x2A70,  # OnePlus
            0x22D9,  # OPPO
            0x2D95,  # Vivo
        ]
        
        if hasattr(port, 'vid') and port.vid in known_mobile_vids:
            return True
        
        return False
    
    def get_device_by_type(self, device_type: str) -> Optional[DeviceInfo]:
        """
        Get first device of specified type.
        
        Args:
            device_type: Type of device to find
            
        Returns:
            Device information or None if not found
        """
        devices = self.detect_devices()
        for device in devices:
            if device.device_type == device_type:
                return device
        return None
    
    def wait_for_device(self, device_type: Optional[str] = None, timeout: Optional[int] = None) -> Optional[DeviceInfo]:
        """
        Wait for a device to be connected.
        
        Args:
            device_type: Specific device type to wait for (optional)
            timeout: Maximum time to wait in seconds (optional)
            
        Returns:
            Device information or None if timeout
        """
        timeout = timeout or self.timeout
        start_time = time.time()
        
        self.logger.info(f"Waiting for device{f' of type {device_type}' if device_type else ''}...")
        
        while time.time() - start_time < timeout:
            devices = self.detect_devices(rescan=True)
            
            if device_type:
                for device in devices:
                    if device.device_type == device_type:
                        self.logger.info(f"Device found: {device}")
                        return device
            else:
                if devices:
                    device = devices[0]  # Return first device found
                    self.logger.info(f"Device found: {device}")
                    return device
            
            time.sleep(1)
        
        self.logger.warning("No device found within timeout period")
        return None
    
    def is_device_connected(self, device_info: DeviceInfo) -> bool:
        """
        Check if a specific device is still connected.
        
        Args:
            device_info: Device information to check
            
        Returns:
            True if device is still connected
        """
        current_devices = self.detect_devices(rescan=True)
        
        for device in current_devices:
            if (device.device_type == device_info.device_type and
                device.connection_info.get('device_id') == device_info.connection_info.get('device_id') and
                device.connection_info.get('port') == device_info.connection_info.get('port')):
                return True
        
        return False
