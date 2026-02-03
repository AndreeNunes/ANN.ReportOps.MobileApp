import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { styles } from './styles';
import moment from 'moment';
import { formatDateTime } from '../../util/date';

export default function DateTimePickerField({
  label = 'Data e hora',
  value,
  onChange,
  minimumDate = new Date('2024-01-01T00:00:00.000Z'),
  maximumDate = new Date('2030-01-31T23:59:59.999Z'),
}) {
  const [open, setOpen] = useState(false);

  const displayValue = value ? formatDateTime(value) : 'Selecionar data e hora';

  const datePickerValue = () => {
    if (!value) {
      return new Date();
    }

    const valueAdd3Hours = new Date(value.getTime() + 3 * 60 * 60 * 1000);

    return valueAdd3Hours;
  }


  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.text}>{displayValue}</Text>
      </TouchableOpacity>

      <DatePicker
        modal
        title="Selecionar data e hora"
        confirmText="Confirmar"
        cancelText="Cancelar"
        open={open}
        date={datePickerValue()}
        mode="datetime"
        locale="pt-BR"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={(date) => {
          setOpen(false);

          const dateSaoPauloString = moment(date).tz('America/Sao_Paulo', true).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
          
          onChange(new Date(dateSaoPauloString));
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
}
