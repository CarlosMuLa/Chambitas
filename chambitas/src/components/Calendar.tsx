import React, { useState } from 'react';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { YStack } from 'tamagui';

// Configuración Global en Español
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

// Props que acepta tu componente
interface MyCalendarProps {
  onDateSelect?: (date: string) => void;
  markedDates?: { [key: string]: any }; // Para pasar puntos rojos, azules, etc.
}

export const MyCalendar = ({ onDateSelect, markedDates = {} }: MyCalendarProps) => {
  const [selected, setSelected] = useState('');

  const handleDayPress = (day: DateData) => {
    setSelected(day.dateString);
    if (onDateSelect) {
      onDateSelect(day.dateString);
    }
  };

  // Fusionamos la selección actual con las marcas que vienen de fuera (ej. días con chamba)
  const combinedMarkedDates = {
    ...markedDates,
    [selected]: {
      selected: true,
      disableTouchEvent: true,
      selectedDotColor: 'orange',
      ...markedDates[selected] // Mantiene el punto si el día seleccionado tenía evento
    }
  };

  return (
    <YStack style={{
      backgroundColor: "white",
      borderRadius: 16,
      padding: 8,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3 // Sombra para Android
    }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={combinedMarkedDates}
        // Personalización de colores para que combine con tu App
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#FA812F', // Tu Naranja
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#FA812F',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#FA812F',
          selectedDotColor: '#ffffff',
          arrowColor: '#FA812F',
          monthTextColor: '#FA812F',
          indicatorColor: '#FA812F',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14
        }}
      />
    </YStack>
  );
};