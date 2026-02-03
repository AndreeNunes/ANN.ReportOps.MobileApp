import { View, Pressable, Text } from 'react-native';
import { styles } from './styles';

export default function SegmentedRadio({
  label,
  options,
  value,
  onChange,
}) {
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
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  selected && styles.segmentTextSelected,
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
