import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type SensorFilterType = '1h' | '1d' | '1w' | '1m' | 'custom';

type SensorLogFilterProps = {
  activeFilter: SensorFilterType;
  onChangeFilter: (filter: SensorFilterType) => void;
};

type FilterButtonProps = {
  label: string;
  value: SensorFilterType;
  activeFilter: SensorFilterType;
  onPress: (filter: SensorFilterType) => void;
};

function FilterButton({
  label,
  value,
  activeFilter,
  onPress,
}: FilterButtonProps) {
  const isActive = activeFilter === value;

  return (
    <Pressable
      style={[styles.filterButton, isActive && styles.activeFilterButton]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function SensorLogFilter({
  activeFilter,
  onChangeFilter,
}: SensorLogFilterProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Filter Data Log</Text>

      <View style={styles.filterContainer}>
        <FilterButton
          label="1 Jam"
          value="1h"
          activeFilter={activeFilter}
          onPress={onChangeFilter}
        />

        <FilterButton
          label="1 Hari"
          value="1d"
          activeFilter={activeFilter}
          onPress={onChangeFilter}
        />

        <FilterButton
          label="1 Minggu"
          value="1w"
          activeFilter={activeFilter}
          onPress={onChangeFilter}
        />

        <FilterButton
          label="1 Bulan"
          value="1m"
          activeFilter={activeFilter}
          onPress={onChangeFilter}
        />

        <FilterButton
          label="Pilih Tanggal"
          value="custom"
          activeFilter={activeFilter}
          onPress={onChangeFilter}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#064E3B',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 12,
    elevation: 4,
  },

  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 14,
  },

  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  filterButton: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  activeFilterButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },

  filterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },
});