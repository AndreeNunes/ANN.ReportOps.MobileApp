import { View, Pressable, Text } from 'react-native';
import { styles } from './styles';

export default function SegmentedRadio({
  label,
  options,
  value,
  onChange,
}) {
  function getContrastingTextColor(hexColor) {
    try {
      if (!hexColor || typeof hexColor !== 'string') return '#ffffff';
      let hex = hexColor.replace('#', '').trim();
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      if (hex.length !== 6) return '#ffffff';
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      // Perceived luminance
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luminance > 160 ? '#000000' : '#ffffff';
    } catch {
      return '#ffffff';
    }
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.segmentContainer}>
        {options.map(opt => {
          const selected = value === opt.value;

          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[
                styles.segment,
                selected && styles.segmentSelected,
                selected && opt?.color ? { backgroundColor: opt.color } : null,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  selected && styles.segmentTextSelected,
                  selected && opt?.color ? { color: getContrastingTextColor(opt.color) } : null,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
