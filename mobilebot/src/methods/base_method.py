"""
Base method class for IMEI reading implementations.

This module defines the abstract base class that all IMEI reading
methods must implement.
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from core.device_detector import DeviceInfo


class IMEIReadResult:
    """Result of IMEI reading operation."""
    
    def __init__(self, success: bool, imei: Optional[str] = None, 
                 error: Optional[str] = None, method: Optional[str] = None,
                 device_info: Optional[Dict[str, Any]] = None):
        """
        Initialize IMEI read result.
        
        Args:
            success: Whether the operation was successful
            imei: IMEI string if successful
            error: Error message if failed
            method: Method used for reading
            device_info: Additional device information
        """
        self.success = success
        self.imei = imei
        self.error = error
        self.method = method
        self.device_info = device_info or {}
    
    def __str__(self) -> str:
        """String representation of result."""
        if self.success:
            return f"IMEIReadResult(success=True, imei={self.imei}, method={self.method})"
        else:
            return f"IMEIReadResult(success=False, error={self.error}, method={self.method})"
    
    def __repr__(self) -> str:
        """String representation of result."""
        return self.__str__()


class BaseMethod(ABC):
    """Abstract base class for IMEI reading methods."""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the method.
        
        Args:
            config: Configuration dictionary for this method
        """
        self.config = config
        self.method_name = self.__class__.__name__
    
    @abstractmethod
    def is_compatible(self, device: DeviceInfo) -> bool:
        """
        Check if this method is compatible with the given device.
        
        Args:
            device: Device information
            
        Returns:
            True if method can work with this device
        """
        pass
    
    @abstractmethod
    def read_imei(self, device: DeviceInfo) -> IMEIReadResult:
        """
        Read IMEI from the given device.
        
        Args:
            device: Device information
            
        Returns:
            Result of IMEI reading operation
        """
        pass
    
    @abstractmethod
    def test_connection(self, device: DeviceInfo) -> bool:
        """
        Test if connection to device is working.
        
        Args:
            device: Device information
            
        Returns:
            True if connection is working
        """
        pass
    
    def get_priority(self) -> int:
        """
        Get priority of this method (lower number = higher priority).
        
        Returns:
            Priority value
        """
        return 50  # Default priority
    
    def get_method_info(self) -> Dict[str, Any]:
        """
        Get information about this method.
        
        Returns:
            Dictionary with method information
        """
        return {
            "name": self.method_name,
            "priority": self.get_priority(),
            "description": self.__doc__ or "No description available"
        }
    
    def cleanup(self) -> None:
        """
        Cleanup method called after reading IMEI.
        Override in subclasses if cleanup is needed.
        """
        pass
