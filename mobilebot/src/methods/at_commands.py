"""
AT Commands method for reading IMEI from serial devices.

This module implements IMEI reading using AT commands for devices
that support serial communication.
"""

import serial
import time
import re
from typing import Dict, Any, List
from methods.base_method import BaseMethod, IMEIReadResult
from core.device_detector import DeviceInfo
from utils.helpers import validate_imei, format_imei
from utils.logger import setup_logger


class ATCommandsMethod(BaseMethod):
    """IMEI reading method using AT commands over serial connection."""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize AT Commands method.
        
        Args:
            config: Configuration dictionary
        """
        super().__init__(config)
        self.logger = setup_logger("ATCommandsMethod", config.get("logging", {}))
        self.baudrate = config.get("baudrate", 115200)
        self.timeout = config.get("timeout", 1)
        self.at_commands = config.get("at_commands", [
            "AT+CGSN",
            "AT+GSN", 
            "AT+CIMI"
        ])
        self.serial_connection = None
    
    def is_compatible(self, device: DeviceInfo) -> bool:
        """
        Check if AT Commands method is compatible with the device.
        
        Args:
            device: Device information
            
        Returns:
            True if device supports serial communication
        """
        return device.device_type == 'serial'
    
    def get_priority(self) -> int:
        """Get method priority (AT Commands has medium priority)."""
        return 30
    
    def test_connection(self, device: DeviceInfo) -> bool:
        """
        Test serial connection to device.
        
        Args:
            device: Device information
            
        Returns:
            True if serial connection is working
        """
        if not self.is_compatible(device):
            return False
        
        port = device.connection_info.get('port')
        if not port:
            return False
        
        try:
            # Test basic serial connection
            with serial.Serial(port, self.baudrate, timeout=self.timeout) as ser:
                time.sleep(0.1)  # Wait for connection to stabilize
                
                # Send basic AT command
                ser.write(b'AT\r\n')
                time.sleep(0.1)
                
                response = ser.read(100).decode('utf-8', errors='ignore')
                return 'OK' in response.upper()
        
        except Exception as e:
            self.logger.warning(f"Serial connection test failed for {port}: {e}")
            return False
    
    def read_imei(self, device: DeviceInfo) -> IMEIReadResult:
        """
        Read IMEI using AT commands.
        
        Args:
            device: Device information
            
        Returns:
            Result of IMEI reading operation
        """
        if not self.is_compatible(device):
            return IMEIReadResult(
                success=False,
                error="Device is not compatible with AT Commands method",
                method=self.method_name
            )
        
        port = device.connection_info.get('port')
        if not port:
            return IMEIReadResult(
                success=False,
                error="No serial port specified in device information",
                method=self.method_name
            )
        
        self.logger.info(f"Reading IMEI from serial device {port}")
        
        try:
            # Open serial connection
            self.serial_connection = serial.Serial(
                port, 
                self.baudrate, 
                timeout=self.timeout
            )
            
            time.sleep(0.2)  # Wait for connection to stabilize
            
            # Try each AT command
            for command in self.at_commands:
                try:
                    self.logger.debug(f"Trying AT command: {command}")
                    result = self._execute_at_command(command)
                    
                    if result.success and result.imei:
                        self.logger.info(f"Successfully read IMEI using command: {command}")
                        result.method = f"{self.method_name}({command})"
                        return result
                
                except Exception as e:
                    self.logger.warning(f"AT command '{command}' failed: {e}")
                    continue
            
            return IMEIReadResult(
                success=False,
                error="All AT commands failed to retrieve IMEI",
                method=self.method_name,
                device_info=device.connection_info
            )
        
        except Exception as e:
            return IMEIReadResult(
                success=False,
                error=f"Serial connection failed: {str(e)}",
                method=self.method_name
            )
        
        finally:
            self.cleanup()
    
    def _execute_at_command(self, command: str) -> IMEIReadResult:
        """
        Execute AT command and parse response.
        
        Args:
            command: AT command to execute
            
        Returns:
            Result of command execution
        """
        if not self.serial_connection:
            return IMEIReadResult(
                success=False,
                error="No serial connection available",
                method=self.method_name
            )
        
        try:
            # Clear input buffer
            self.serial_connection.flushInput()
            
            # Send AT command
            cmd_bytes = f"{command}\r\n".encode('utf-8')
            self.serial_connection.write(cmd_bytes)
            
            # Wait for response
            time.sleep(0.2)
            
            # Read response
            response = b""
            start_time = time.time()
            
            while time.time() - start_time < self.timeout * 2:
                if self.serial_connection.in_waiting > 0:
                    chunk = self.serial_connection.read(self.serial_connection.in_waiting)
                    response += chunk
                    
                    # Check if we have a complete response
                    if b'\r\n' in response or b'OK' in response or b'ERROR' in response:
                        break
                
                time.sleep(0.01)
            
            # Decode response
            response_str = response.decode('utf-8', errors='ignore').strip()
            self.logger.debug(f"AT command '{command}' response: {response_str}")
            
            # Parse IMEI from response
            imei = self._parse_at_response(response_str, command)
            
            if imei:
                return IMEIReadResult(
                    success=True,
                    imei=imei,
                    method=self.method_name,
                    device_info={
                        'command_used': command,
                        'raw_response': response_str
                    }
                )
            else:
                return IMEIReadResult(
                    success=False,
                    error=f"Could not extract IMEI from response: {response_str}",
                    method=self.method_name
                )
        
        except Exception as e:
            return IMEIReadResult(
                success=False,
                error=f"AT command execution failed: {str(e)}",
                method=self.method_name
            )
    
    def _parse_at_response(self, response: str, command: str) -> str:
        """
        Parse AT command response to extract IMEI.
        
        Args:
            response: Raw AT command response
            command: Command that was executed
            
        Returns:
            IMEI string or None if not found
        """
        if not response:
            return None
        
        # Clean response
        lines = response.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip echo of command and common AT responses
            if (line and 
                not line.startswith(command) and 
                line not in ['OK', 'ERROR', 'AT']):
                cleaned_lines.append(line)
        
        # Look for IMEI in cleaned lines
        for line in cleaned_lines:
            # Remove any non-digit characters except spaces
            digits_only = re.sub(r'[^\d\s]', '', line)
            
            # Find 15-digit sequences
            digit_sequences = re.findall(r'\d+', digits_only)
            
            for seq in digit_sequences:
                if len(seq) == 15:
                    formatted_imei = format_imei(seq)
                    if formatted_imei and validate_imei(formatted_imei):
                        return formatted_imei
        
        # Fallback: look for any 15-digit sequence in the entire response
        all_digits = re.findall(r'\d{15}', response)
        for digits in all_digits:
            if validate_imei(digits):
                return digits
        
        return None
    
    def _try_different_bauds(self, port: str, commands: List[str]) -> IMEIReadResult:
        """
        Try different baud rates if default fails.
        
        Args:
            port: Serial port to try
            commands: List of AT commands to try
            
        Returns:
            Result of IMEI reading
        """
        common_bauds = [115200, 9600, 19200, 38400, 57600, 230400]
        
        for baud in common_bauds:
            if baud == self.baudrate:
                continue  # Already tried default
            
            try:
                self.logger.debug(f"Trying baud rate: {baud}")
                
                with serial.Serial(port, baud, timeout=self.timeout) as ser:
                    time.sleep(0.1)
                    
                    for command in commands:
                        try:
                            # Test basic AT first
                            ser.write(b'AT\r\n')
                            time.sleep(0.1)
                            response = ser.read(100).decode('utf-8', errors='ignore')
                            
                            if 'OK' in response.upper():
                                # Connection works, try IMEI command
                                self.serial_connection = ser
                                result = self._execute_at_command(command)
                                if result.success:
                                    return result
                        
                        except Exception:
                            continue
            
            except Exception as e:
                self.logger.debug(f"Baud rate {baud} failed: {e}")
                continue
        
        return IMEIReadResult(
            success=False,
            error="Failed with all baud rates",
            method=self.method_name
        )
    
    def cleanup(self) -> None:
        """Cleanup serial connection."""
        if self.serial_connection and self.serial_connection.is_open:
            try:
                self.serial_connection.close()
            except Exception as e:
                self.logger.warning(f"Error closing serial connection: {e}")
            finally:
                self.serial_connection = None
