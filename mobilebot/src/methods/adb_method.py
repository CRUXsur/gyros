"""
ADB method for reading IMEI from Android devices.

This module implements IMEI reading using Android Debug Bridge (ADB)
for Android devices with developer options enabled.
"""

import subprocess
import re
from typing import Dict, Any
from methods.base_method import BaseMethod, IMEIReadResult
from core.device_detector import DeviceInfo
from utils.helpers import extract_imei_from_hex, validate_imei
from utils.logger import setup_logger


class ADBMethod(BaseMethod):
    """IMEI reading method using Android Debug Bridge."""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize ADB method.
        
        Args:
            config: Configuration dictionary
        """
        super().__init__(config)
        self.logger = setup_logger("ADBMethod", config.get("logging", {}))
        self.command_timeout = config.get("command_timeout", 5)
        self.service_call_command = config.get("service_call_command", "service call iphonesubinfo 1")
        self.alternative_commands = config.get("alternative_commands", [
            "service call iphonesubinfo 3",
            "dumpsys iphonesubinfo"
        ])
    
    def is_compatible(self, device: DeviceInfo) -> bool:
        """
        Check if ADB method is compatible with the device.
        
        Args:
            device: Device information
            
        Returns:
            True if device is Android and ADB accessible
        """
        return device.device_type == 'android'
    
    def get_priority(self) -> int:
        """Get method priority (ADB has high priority for Android devices)."""
        return 10
    
    def test_connection(self, device: DeviceInfo) -> bool:
        """
        Test ADB connection to device.
        
        Args:
            device: Device information
            
        Returns:
            True if ADB connection is working
        """
        if not self.is_compatible(device):
            return False
        
        try:
            adb_path = device.connection_info.get('adb_path', 'adb')
            device_id = device.connection_info.get('device_id')
            
            # Test basic ADB connection
            cmd = [adb_path, "-s", device_id, "shell", "echo", "test"]
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=self.command_timeout
            )
            
            return result.returncode == 0 and "test" in result.stdout
        
        except Exception as e:
            self.logger.warning(f"ADB connection test failed: {e}")
            return False
    
    def read_imei(self, device: DeviceInfo) -> IMEIReadResult:
        """
        Read IMEI using ADB commands.
        
        Args:
            device: Device information
            
        Returns:
            Result of IMEI reading operation
        """
        if not self.is_compatible(device):
            return IMEIReadResult(
                success=False,
                error="Device is not compatible with ADB method",
                method=self.method_name
            )
        
        adb_path = device.connection_info.get('adb_path', 'adb')
        device_id = device.connection_info.get('device_id')
        
        self.logger.info(f"Reading IMEI from Android device {device_id}")
        
        # Try primary command first
        commands_to_try = [self.service_call_command] + self.alternative_commands
        
        for command in commands_to_try:
            try:
                self.logger.debug(f"Trying command: {command}")
                result = self._execute_adb_command(adb_path, device_id, command)
                
                if result.success and result.imei:
                    self.logger.info(f"Successfully read IMEI using command: {command}")
                    result.method = f"{self.method_name}({command})"
                    return result
                
            except Exception as e:
                self.logger.warning(f"Command '{command}' failed: {e}")
                continue
        
        return IMEIReadResult(
            success=False,
            error="All ADB commands failed to retrieve IMEI",
            method=self.method_name,
            device_info=device.connection_info
        )
    
    def _execute_adb_command(self, adb_path: str, device_id: str, command: str) -> IMEIReadResult:
        """
        Execute ADB command and parse result.
        
        Args:
            adb_path: Path to ADB executable
            device_id: Android device ID
            command: Command to execute
            
        Returns:
            Result of command execution
        """
        try:
            # Build ADB command
            if command.startswith('shell '):
                cmd = [adb_path, "-s", device_id] + command.split()
            else:
                cmd = [adb_path, "-s", device_id, "shell"] + command.split()
            
            # Execute command
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=self.command_timeout
            )
            
            if result.returncode != 0:
                return IMEIReadResult(
                    success=False,
                    error=f"ADB command failed with code {result.returncode}: {result.stderr}",
                    method=self.method_name
                )
            
            # Parse output
            output = result.stdout.strip()
            self.logger.debug(f"ADB command output: {output}")
            
            # Extract IMEI from output
            imei = self._parse_adb_output(output, command)
            
            if imei:
                return IMEIReadResult(
                    success=True,
                    imei=imei,
                    method=self.method_name,
                    device_info={
                        'command_used': command,
                        'raw_output': output
                    }
                )
            else:
                return IMEIReadResult(
                    success=False,
                    error=f"Could not extract IMEI from command output: {output}",
                    method=self.method_name
                )
        
        except subprocess.TimeoutExpired:
            return IMEIReadResult(
                success=False,
                error="ADB command timed out",
                method=self.method_name
            )
        
        except Exception as e:
            return IMEIReadResult(
                success=False,
                error=f"ADB command execution failed: {str(e)}",
                method=self.method_name
            )
    
    def _parse_adb_output(self, output: str, command: str) -> str:
        """
        Parse ADB command output to extract IMEI.
        
        Args:
            output: Raw ADB command output
            command: Command that was executed
            
        Returns:
            IMEI string or None if not found
        """
        if not output:
            return None
        
        # Different parsing strategies based on command type
        if "service call iphonesubinfo" in command:
            return self._parse_service_call_output(output)
        elif "dumpsys iphonesubinfo" in command:
            return self._parse_dumpsys_output(output)
        else:
            # Generic parsing
            return extract_imei_from_hex(output)
    
    def _parse_service_call_output(self, output: str) -> str:
        """
        Parse service call iphonesubinfo output.
        
        Args:
            output: Raw service call output
            
        Returns:
            IMEI string or None
        """
        # Service call output format: "Result: Parcel(00000000 xxxxxxxx '123456789012345' xxxxxxxx)"
        # or hex format that needs conversion
        
        # First try to find IMEI in quotes
        quote_patterns = [
            r"'(\d{15})'",
            r'"(\d{15})"',
        ]
        
        for pattern in quote_patterns:
            match = re.search(pattern, output)
            if match:
                imei = match.group(1)
                if validate_imei(imei):
                    return imei
        
        # Try hex conversion method
        return extract_imei_from_hex(output)
    
    def _parse_dumpsys_output(self, output: str) -> str:
        """
        Parse dumpsys iphonesubinfo output.
        
        Args:
            output: Raw dumpsys output
            
        Returns:
            IMEI string or None
        """
        # Look for IMEI patterns in dumpsys output
        patterns = [
            r"Device ID = (\d{15})",
            r"IMEI = (\d{15})",
            r"mImei = (\d{15})",
            r"(\d{15})",  # Just 15 digits
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, output)
            for match in matches:
                if validate_imei(match):
                    return match
        
        return None
    
    def cleanup(self) -> None:
        """Cleanup ADB method resources."""
        # No specific cleanup needed for ADB method
        pass
