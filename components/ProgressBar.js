import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

// Progress bar component: displays percentage fill and optional threshold marker
export default function ProgressBar({
  value,
  color = colors.accent,
  marker = null,
  height = 8,
}) {
  let filled = 0;
  if (value) {
    filled = value;
  }

  if (filled < 0) {
    filled = 0;
  } else if (filled > 100) {
    filled = 100;
  }

  let markerView = null;
  if (marker !== null) {
    let markerPos = marker;
    if (markerPos < 0) {
      markerPos = 0;
    } else if (markerPos > 100) {
      markerPos = 100;
    }

    markerView = (
      <View style={[styles.marker, { left: `${markerPos}%` }]} />
    );
  }

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${filled}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
      {markerView}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
  },
  marker: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 2,
    marginLeft: -1,
    backgroundColor: colors.textSecondary,
    borderRadius: radius.sm,
  },
});
