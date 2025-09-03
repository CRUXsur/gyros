"""
Main IMEI reader class for MobileBot.

This module orchestrates device detection and IMEI reading using
various methods and provides a unified interface.
"""

import time
from typing import List, Dict, Any, Optional
from core.device_detector import DeviceDetector, DeviceInfo
from core.config import Config
from methods.base_method import BaseMethod, IMEIReadResult
from methods.adb_method import ADBMethod
from methods.at_commands import ATCommandsMethod
from utils.logger import setup_logger, console
from utils.helpers import validate_imei, get_timestamp


class IMEIReader:
    """Main IMEI reader class."""
    
    def __init__(self, config_file: Optional[str] = None):
        """
        Initialize IMEI reader.
        
        Args:
            config_file: Path to configuration file (optional)
        """
        # Load configuration
        self.config = Config(config_file)
        self.config.update_from_env()
        
        # Setup logging
        self.logger = setup_logger("IMEIReader", self.config.get_logging_config())
        
        # Initialize device detector
        self.device_detector = DeviceDetector(self.config.get_device_detection_config())
        
        # Initialize reading methods
        self.methods: List[BaseMethod] = []
        self._initialize_methods()
        
        # Sort methods by priority
        self.methods.sort(key=lambda m: m.get_priority())
        
        self.logger.info(f"Initialized IMEIReader with {len(self.methods)} methods")
    
    def _initialize_methods(self) -> None:
        """Initialize all available IMEI reading methods."""
        try:
            # ADB method for Android devices
            adb_method = ADBMethod(self.config.get_adb_config())
            self.methods.append(adb_method)
            self.logger.debug("Initialized ADB method")
        except Exception as e:
            self.logger.warning(f"Failed to initialize ADB method: {e}")
        
        try:
            # AT Commands method for serial devices
            at_method = ATCommandsMethod(self.config.get_serial_config())
            self.methods.append(at_method)
            self.logger.debug("Initialized AT Commands method")
        except Exception as e:
            self.logger.warning(f"Failed to initialize AT Commands method: {e}")
    
    def read_imei_auto(self, timeout: int = 30) -> IMEIReadResult:
        """
        Automatically detect device and read IMEI.
        
        Args:
            timeout: Maximum time to wait for device detection
            
        Returns:
            Result of IMEI reading operation
        """
        self.logger.info("Starting automatic IMEI reading...")
        console.log("🔍 Scanning for connected mobile devices...")
        
        # Detect devices
        start_time = time.time()
        device = None
        
        while time.time() - start_time < timeout:
            devices = self.device_detector.detect_devices(rescan=True)
            
            if devices:
                device = devices[0]  # Use first detected device
                break
            
            console.log("⏳ No devices found, waiting...")
            time.sleep(2)
        
        if not device:
            result = IMEIReadResult(
                success=False,
                error=f"No compatible devices found within {timeout} seconds",
                method="auto_detection"
            )
            console.error("❌ No devices detected")
            return result
        
        console.log(f"📱 Found device: {device.device_type} - {device.connection_info}")
        
        # Read IMEI from detected device
        return self.read_imei_from_device(device)
    
    def read_imei_from_device(self, device: DeviceInfo) -> IMEIReadResult:
        """
        Read IMEI from a specific device.
        
        Args:
            device: Device information
            
        Returns:
            Result of IMEI reading operation
        """
        self.logger.info(f"Reading IMEI from device: {device}")
        console.log(f"🔧 Attempting to read IMEI from {device.device_type} device...")
        
        # Find compatible methods for this device
        compatible_methods = [
            method for method in self.methods 
            if method.is_compatible(device)
        ]
        
        if not compatible_methods:
            result = IMEIReadResult(
                success=False,
                error=f"No compatible methods found for device type: {device.device_type}",
                method="method_selection"
            )
            console.error(f"❌ No compatible methods for {device.device_type} devices")
            return result
        
        console.log(f"🛠️  Found {len(compatible_methods)} compatible method(s)")
        
        # Try each compatible method
        for method in compatible_methods:
            try:
                self.logger.info(f"Trying method: {method.method_name}")
                console.log(f"⚡ Trying {method.method_name}...")
                
                # Test connection first
                if not method.test_connection(device):
                    self.logger.warning(f"Connection test failed for {method.method_name}")
                    console.warn(f"⚠️  Connection test failed for {method.method_name}")
                    continue
                
                # Read IMEI
                result = method.read_imei(device)
                
                if result.success and result.imei:
                    # Validate IMEI
                    if validate_imei(result.imei):
                        self.logger.info(f"Successfully read IMEI: {result.imei}")
                        console.log(f"✅ IMEI successfully read: {result.imei}")
                        
                        # Display in console.log style
                        self._display_imei_result(result, device)
                        
                        return result
                    else:
                        self.logger.warning(f"Invalid IMEI format: {result.imei}")
                        console.warn(f"⚠️  Invalid IMEI format: {result.imei}")
                        continue
                else:
                    self.logger.warning(f"Method {method.method_name} failed: {result.error}")
                    console.warn(f"⚠️  {method.method_name} failed: {result.error}")
                    continue
            
            except Exception as e:
                self.logger.error(f"Error with method {method.method_name}: {e}")
                console.error(f"❌ Error with {method.method_name}: {e}")
                continue
            
            finally:
                # Cleanup method resources
                try:
                    method.cleanup()
                except Exception as e:
                    self.logger.warning(f"Cleanup error for {method.method_name}: {e}")
        
        # All methods failed
        result = IMEIReadResult(
            success=False,
            error="All compatible methods failed to read IMEI",
            method="all_methods_failed",
            device_info=device.connection_info
        )
        console.error("❌ All methods failed to read IMEI")
        return result
    
    def _display_imei_result(self, result: IMEIReadResult, device: DeviceInfo) -> None:
        """
        Display IMEI result in console.log style.
        
        Args:
            result: IMEI reading result
            device: Device information
        """
        output_config = self.config.get_output_config()
        
        # Prepare display data
        timestamp = get_timestamp() if output_config.get("show_timestamp", True) else None
        device_info = device.connection_info if output_config.get("show_device_info", True) else {}
        
        # Create console.log style output
        if output_config.get("console_log_style", True):
            console.log("=" * 50)
            console.log("📱 MOBILE DEVICE IMEI READER")
            console.log("=" * 50)
            
            if timestamp:
                console.log(f"⏰ Timestamp: {timestamp}")
            
            console.log(f"📋 IMEI: {result.imei}")
            console.log(f"🔧 Method: {result.method}")
            console.log(f"📱 Device Type: {device.device_type}")
            
            if device_info:
                console.log("📊 Device Information:")
                for key, value in device_info.items():
                    console.log(f"   {key}: {value}")
            
            console.log("=" * 50)
        else:
            # Simple output
            console.log(f"IMEI: {result.imei}")
    
    def list_available_methods(self) -> List[Dict[str, Any]]:
        """
        Get list of available reading methods.
        
        Returns:
            List of method information dictionaries
        """
        return [method.get_method_info() for method in self.methods]
    
    def get_device_list(self) -> List[DeviceInfo]:
        """
        Get list of detected devices.
        
        Returns:
            List of detected devices
        """
        return self.device_detector.detect_devices()
    
    def wait_for_device_and_read(self, device_type: Optional[str] = None, timeout: int = 60) -> IMEIReadResult:
        """
        Wait for a device to be connected and read its IMEI.
        
        Args:
            device_type: Specific device type to wait for (optional)
            timeout: Maximum time to wait in seconds
            
        Returns:
            Result of IMEI reading operation
        """
        console.log(f"⏳ Waiting for device{f' of type {device_type}' if device_type else ''}...")
        
        device = self.device_detector.wait_for_device(device_type, timeout)
        
        if device:
            console.log(f"📱 Device connected: {device}")
            return self.read_imei_from_device(device)
        else:
            result = IMEIReadResult(
                success=False,
                error=f"No device found within {timeout} seconds",
                method="wait_for_device"
            )
            console.error(f"❌ No device found within {timeout} seconds")
            return result
    
    def read_imei_with_method(self, device: DeviceInfo, method_name: str) -> IMEIReadResult:
        """
        Read IMEI using a specific method.
        
        Args:
            device: Device information
            method_name: Name of method to use
            
        Returns:
            Result of IMEI reading operation
        """
        # Find the specified method
        method = None
        for m in self.methods:
            if m.method_name == method_name:
                method = m
                break
        
        if not method:
            return IMEIReadResult(
                success=False,
                error=f"Method '{method_name}' not found",
                method=method_name
            )
        
        if not method.is_compatible(device):
            return IMEIReadResult(
                success=False,
                error=f"Method '{method_name}' is not compatible with device type '{device.device_type}'",
                method=method_name
            )
        
        try:
            console.log(f"🔧 Using method: {method_name}")
            
            # Test connection
            if not method.test_connection(device):
                return IMEIReadResult(
                    success=False,
                    error=f"Connection test failed for method '{method_name}'",
                    method=method_name
                )
            
            # Read IMEI
            result = method.read_imei(device)
            
            if result.success:
                self._display_imei_result(result, device)
            
            return result
        
        finally:
            method.cleanup()
    
    def get_config(self) -> Config:
        """Get configuration object."""
        return self.config
    
    def cleanup(self) -> None:
        """Cleanup all resources."""
        for method in self.methods:
            try:
                method.cleanup()
            except Exception as e:
                self.logger.warning(f"Cleanup error for {method.method_name}: {e}")
        
        self.logger.info("IMEIReader cleanup completed")
