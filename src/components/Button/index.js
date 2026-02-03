import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { styles } from './styles';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const getButtonStyle = () => {
    let buttonStyle = [styles.button, styles[`button_${variant}`], styles[`button_${size}`]];
    
    if (isPressed) {
      buttonStyle.push(styles.buttonPressed);
    }
    
    if (disabled) {
      buttonStyle.push(styles.buttonDisabled);
    }
    
    if (style) {
      buttonStyle.push(style);
    }
    
    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleArray = [styles.text, styles[`text_${variant}`], styles[`text_${size}`]];
    
    if (disabled) {
      textStyleArray.push(styles.textDisabled);
    }
    
    if (textStyle) {
      textStyleArray.push(textStyle);
    }
    
    return textStyleArray;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#FFFFFF' : '#3B82F6'} 
          />
          <Text style={[getTextStyle(), { marginLeft: 8 }]}>
            Carregando...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <Text style={getTextStyle()}>
          {title}
        </Text>
        
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
