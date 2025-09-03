"""
Configuration management for MobileBot IMEI Reader.

This module handles loading and managing configuration settings
from JSON files and environment variables.
"""

import json
import os
from typing import Dict, Any, Optional
from pathlib import Path


class Config:
    """Configuration manager for MobileBot application."""
    
    def __init__(self, config_file: Optional[str] = None):
        """
        Initialize configuration manager.
        
        Args:
            config_file: Path to configuration file (optional)
        """
        self._config = {}
        self._config_file = config_file or self._find_config_file()
        self.load_config()
    
    def _find_config_file(self) -> str:
        """
        Find configuration file in common locations.
        
        Returns:
            Path to configuration file
        """
        # Check current directory
        current_dir = Path.cwd()
        config_paths = [
            current_dir / "config.json",
            current_dir / "mobilebot" / "config.json",
            Path(__file__).parent.parent.parent / "config.json",
        ]
        
        for path in config_paths:
            if path.exists():
                return str(path)
        
        # Return default path
        return str(current_dir / "config.json")
    
    def load_config(self) -> None:
        """Load configuration from file."""
        try:
            with open(self._config_file, 'r', encoding='utf-8') as f:
                self._config = json.load(f)
        except FileNotFoundError:
            print(f"Warning: Configuration file {self._config_file} not found. Using defaults.")
            self._config = self._get_default_config()
        except json.JSONDecodeError as e:
            print(f"Error parsing configuration file: {e}. Using defaults.")
            self._config = self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """
        Get default configuration values.
        
        Returns:
            Default configuration dictionary
        """
        return {
            "logging": {
                "level": "INFO",
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "file_enabled": True,
                "console_enabled": True,
                "log_directory": "logs"
            },
            "device_detection": {
                "scan_interval": 2,
                "timeout": 10,
                "retry_attempts": 3
            },
            "adb": {
                "command_timeout": 5,
                "service_call_command": "service call iphonesubinfo 1",
                "alternative_commands": [
                    "service call iphonesubinfo 3",
                    "dumpsys iphonesubinfo"
                ]
            },
            "serial": {
                "baudrate": 115200,
                "timeout": 1,
                "at_commands": [
                    "AT+CGSN",
                    "AT+GSN",
                    "AT+CIMI"
                ],
                "common_ports": [
                    "COM1", "COM2", "COM3", "COM4", "COM5",
                    "/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyACM0", "/dev/ttyACM1",
                    "/dev/cu.usbmodem", "/dev/cu.usbserial"
                ]
            },
            "output": {
                "console_log_style": True,
                "show_timestamp": True,
                "show_device_info": True
            }
        }
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        Get configuration value by key.
        
        Args:
            key: Configuration key (supports dot notation, e.g., 'logging.level')
            default: Default value if key not found
            
        Returns:
            Configuration value or default
        """
        keys = key.split('.')
        value = self._config
        
        try:
            for k in keys:
                value = value[k]
            return value
        except (KeyError, TypeError):
            return default
    
    def set(self, key: str, value: Any) -> None:
        """
        Set configuration value.
        
        Args:
            key: Configuration key (supports dot notation)
            value: Value to set
        """
        keys = key.split('.')
        config = self._config
        
        # Navigate to the parent dictionary
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        
        # Set the value
        config[keys[-1]] = value
    
    def save_config(self, file_path: Optional[str] = None) -> None:
        """
        Save configuration to file.
        
        Args:
            file_path: Path to save configuration (optional)
        """
        save_path = file_path or self._config_file
        
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            
            with open(save_path, 'w', encoding='utf-8') as f:
                json.dump(self._config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving configuration: {e}")
    
    def get_logging_config(self) -> Dict[str, Any]:
        """
        Get logging configuration.
        
        Returns:
            Logging configuration dictionary
        """
        return self.get('logging', {})
    
    def get_adb_config(self) -> Dict[str, Any]:
        """
        Get ADB configuration.
        
        Returns:
            ADB configuration dictionary
        """
        return self.get('adb', {})
    
    def get_serial_config(self) -> Dict[str, Any]:
        """
        Get serial communication configuration.
        
        Returns:
            Serial configuration dictionary
        """
        return self.get('serial', {})
    
    def get_device_detection_config(self) -> Dict[str, Any]:
        """
        Get device detection configuration.
        
        Returns:
            Device detection configuration dictionary
        """
        return self.get('device_detection', {})
    
    def get_output_config(self) -> Dict[str, Any]:
        """
        Get output configuration.
        
        Returns:
            Output configuration dictionary
        """
        return self.get('output', {})
    
    def update_from_env(self) -> None:
        """Update configuration from environment variables."""
        env_mappings = {
            'MOBILEBOT_LOG_LEVEL': 'logging.level',
            'MOBILEBOT_LOG_DIR': 'logging.log_directory',
            'MOBILEBOT_ADB_TIMEOUT': 'adb.command_timeout',
            'MOBILEBOT_SERIAL_BAUDRATE': 'serial.baudrate',
            'MOBILEBOT_SCAN_INTERVAL': 'device_detection.scan_interval',
        }
        
        for env_var, config_key in env_mappings.items():
            env_value = os.getenv(env_var)
            if env_value is not None:
                # Try to convert to appropriate type
                try:
                    if env_value.isdigit():
                        env_value = int(env_value)
                    elif env_value.lower() in ('true', 'false'):
                        env_value = env_value.lower() == 'true'
                except:
                    pass  # Keep as string
                
                self.set(config_key, env_value)
    
    @property
    def config_file(self) -> str:
        """Get configuration file path."""
        return self._config_file
    
    @property
    def config(self) -> Dict[str, Any]:
        """Get full configuration dictionary."""
        return self._config.copy()
