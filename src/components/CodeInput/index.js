import React, { useMemo, useRef } from 'react';
import { View, Text, TextInput as RNTextInput } from 'react-native';

export default function CodeInput({
  length = 6,
  value = '',
  onChangeValue,
  onComplete,
}) {
  const refs = useRef(Array.from({ length }, () => React.createRef()));
  const chars = useMemo(() => {
    const normalized = String(value || '').slice(0, length);
    return Array.from({ length }, (_, i) => normalized[i] || '');
  }, [value, length]);

  const setCharAt = (index, char) => {
    const normalizedChar = (char || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const arr = [...chars];
    arr[index] = normalizedChar;
    const newVal = arr.join('');
    onChangeValue?.(newVal);
    if (normalizedChar && index < length - 1) {
      refs.current[index + 1]?.current?.focus();
    }
    if (newVal.length === length && !arr.includes('')) {
      onComplete?.(newVal);
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (chars[index]) {
        // clearing current char
        const arr = [...chars];
        arr[index] = '';
        onChangeValue?.(arr.join(''));
      } else if (index > 0) {
        refs.current[index - 1]?.current?.focus();
        const arr = [...chars];
        arr[index - 1] = '';
        onChangeValue?.(arr.join(''));
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length }).map((_, idx) => (
        <React.Fragment key={idx}>
          <RNTextInput
            ref={refs.current[idx]}
            value={chars[idx]}
            onChangeText={(t) => setCharAt(idx, t.slice(-1))}
            onKeyPress={(e) => handleKeyPress(idx, e)}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={1}
            keyboardType="default"
            style={{
              width: 40,
              height: 60,
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: 'rgba(8, 36, 129, 0.28)',
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 16,
              fontFamily: 'Inter-Regular',
              color: '#1F2937',
              marginHorizontal: 4,
            }}
          />
          {idx === 2 && (
            <Text style={{ marginHorizontal: 4, fontSize: 18, color: '#111827' }}>-</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

