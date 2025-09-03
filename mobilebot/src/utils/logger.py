"""
Logging utilities for MobileBot IMEI Reader.

This module provides logging configuration and console output functions
that mimic JavaScript's console.log style.
"""

import logging
import colorlog
import os
from datetime import datetime
from typing import Any


def setup_logger(name: str, config: dict) -> logging.Logger:
    """
    Set up a logger with the specified configuration.
    
    Args:
        name: Logger name
        config: Configuration dictionary with logging settings
        
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, config.get("level", "INFO")))
    
    # Clear existing handlers
    logger.handlers.clear()
    
    # Console handler with colors
    if config.get("console_enabled", True):
        console_handler = colorlog.StreamHandler()
        console_formatter = colorlog.ColoredFormatter(
            "%(log_color)s%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
            log_colors={
                'DEBUG': 'cyan',
                'INFO': 'green',
                'WARNING': 'yellow',
                'ERROR': 'red',
                'CRITICAL': 'red,bg_white',
            }
        )
        console_handler.setFormatter(console_formatter)
        logger.addHandler(console_handler)
    
    # File handler
    if config.get("file_enabled", True):
        log_dir = config.get("log_directory", "logs")
        os.makedirs(log_dir, exist_ok=True)
        
        log_file = os.path.join(log_dir, f"{name}_{datetime.now().strftime('%Y%m%d')}.log")
        file_handler = logging.FileHandler(log_file)
        file_formatter = logging.Formatter(
            config.get("format", "%(asctime)s - %(name)s - %(levelname)s - %(message)s"),
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
    
    return logger


def console_log(*args: Any, **kwargs) -> None:
    """
    JavaScript-style console.log function for Python.
    
    Args:
        *args: Arguments to log
        **kwargs: Additional formatting options
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    
    # Format the message like JavaScript console.log
    if len(args) == 1:
        message = str(args[0])
    else:
        message = " ".join(str(arg) for arg in args)
    
    # Add timestamp if requested
    if kwargs.get("timestamp", True):
        output = f"[{timestamp}] {message}"
    else:
        output = message
    
    # Print with color if specified
    color = kwargs.get("color")
    if color:
        if color == "green":
            print(f"\033[92m{output}\033[0m")
        elif color == "red":
            print(f"\033[91m{output}\033[0m")
        elif color == "yellow":
            print(f"\033[93m{output}\033[0m")
        elif color == "blue":
            print(f"\033[94m{output}\033[0m")
        elif color == "cyan":
            print(f"\033[96m{output}\033[0m")
        else:
            print(output)
    else:
        print(output)


class ConsoleLogger:
    """
    A logger class that mimics JavaScript console methods.
    """
    
    @staticmethod
    def log(*args: Any) -> None:
        """Log a message."""
        console_log(*args)
    
    @staticmethod
    def info(*args: Any) -> None:
        """Log an info message."""
        console_log(*args, color="green")
    
    @staticmethod
    def warn(*args: Any) -> None:
        """Log a warning message."""
        console_log(*args, color="yellow")
    
    @staticmethod
    def error(*args: Any) -> None:
        """Log an error message."""
        console_log(*args, color="red")
    
    @staticmethod
    def debug(*args: Any) -> None:
        """Log a debug message."""
        console_log(*args, color="cyan")


# Global console instance
console = ConsoleLogger()
