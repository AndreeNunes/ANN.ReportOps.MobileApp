import React, { useState, useRef } from 'react';
import { View, TextInput as RNTextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';

const TextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  hint,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  height = 60,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getInputStyle = () => {
    let inputStyle = [styles.input];

    if (multiline) {
      inputStyle.push(styles.inputMultiline);
    }
    
    if (isFocused) {
      inputStyle.push(styles.inputFocused);
    }
    
    if (disabled) {
      inputStyle.push(styles.inputDisabled);
    }
    
    if (style) {
      inputStyle.push(style);
    }
    
    return inputStyle;
  };

  const getLabelStyle = () => {
    let labelStyle = [styles.label];
    
    if (isFocused || value) {
      labelStyle.push(styles.labelFocused);
    }
    
    return labelStyle;
  };

  return (
    <>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <RNTextInput
          ref={inputRef}
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#374151"
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {hint ? (
        <Text style={styles.hint}>
          {hint}
        </Text>
      ) : null}
    </>
  );
};

export default TextInput;
