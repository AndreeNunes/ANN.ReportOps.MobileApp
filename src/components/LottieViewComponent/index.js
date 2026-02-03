import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles } from './styles';

export default function LottieViewComponent({
  source,
  autoPlay = true,
  loop = true,
  speed = 1,
  width = 200,
  height = 200,
}) {
  return (
    <View style={styles.container}>
      <LottieView
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={{ width, height }}
      />
    </View>
  );
}
