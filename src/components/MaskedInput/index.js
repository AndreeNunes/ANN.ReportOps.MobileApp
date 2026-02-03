import React from 'react';
import { View, Text } from 'react-native';
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import { styles } from './styles';

export default function MaskedInput({
  label,
  placeholder,
  value,
  onChangeText,
  onChangeRaw,
  pattern,
  mask,
  useNumberMask = false,
  numberOptions = {
    prefix: [],
    delimiter: '.',
    separator: ',',
    precision: 0,
  },
  keyboardType = 'default',
  editable = true,
  hint,
  style,
  inputStyle,
  suffixText,
  suffixContainerStyle,
  suffixTextStyle,
  ...props
}) {
  const buildMask = (pat) => {
    if (!pat) return undefined;
    const arr = [];
    for (let i = 0; i < pat.length; i++) {
      const ch = pat[i];
      arr.push(ch === '#' ? /\d/ : ch);
    }
    return arr;
  };

  let effectiveMask = undefined;
  
  if (mask) {
    effectiveMask = mask;
  } else if (useNumberMask) {
    effectiveMask = createNumberMask(numberOptions);
  } else {
    effectiveMask = buildMask(pattern);
  }

  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputContainer, style]}>
        <MaskInput
          value={value}
          onChangeText={(masked, unmasked) => {
            onChangeText && onChangeText(masked);
            onChangeRaw && onChangeRaw(unmasked);
          }}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          mask={effectiveMask}
          keyboardType={keyboardType}
          editable={editable}
          style={[styles.input, suffixText ? styles.inputWithSuffix : null, inputStyle]}
          {...props}
        />
        {suffixText ? (
          <View pointerEvents="none" style={[styles.suffixContainer, suffixContainerStyle]}>
            <Text style={[styles.suffixText, suffixTextStyle]}>{suffixText}</Text>
          </View>
        ) : null}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </>
  );
}
