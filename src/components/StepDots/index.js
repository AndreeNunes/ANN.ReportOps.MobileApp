import React from 'react';
import { View } from 'react-native';

export default function StepDots({ current = 1, total = 3, position = 'bottom' }) {
  const dots = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: position === 'top' ? 12 : 0,
      marginBottom: position === 'bottom' ? 12 : 0,
    }}>
      {dots.map((n) => {
        const active = n === current;
        return (
          <View
            key={n}
            style={{
              width: active ? 10 : 8,
              height: active ? 10 : 8,
              borderRadius: 999,
              backgroundColor: active ? 'rgba(8, 36, 129, 0.98)' : '#cbd5e1',
              marginHorizontal: 6,
            }}
          />
        );
      })}
    </View>
  );
}

