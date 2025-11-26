import React, { useState, useMemo } from 'react';
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
  // markedDates ahora representa días ocupados o con eventos
  reservedDates?: string[]; // Ej: ['2025-11-28', '2025-11-29']
}

export const MyCalendar = ({ onDateSelect, reservedDates = [] }: MyCalendarProps) => {
  const [selected, setSelected] = useState('');

  // 1. Obtenemos la fecha de hoy en formato YYYY-MM-DD para bloquear el pasado
  const today = new Date().toISOString().split('T')[0];

  // 2. Transformamos el array de fechas reservadas al formato del calendario
  const markedDates = useMemo(() => {
    const marks: any = {};

    // Marcamos los días reservados (vienen de la BD)
    reservedDates.forEach(date => {
      marks[date] = {
        disabled: true,          // No se puede seleccionar
        disableTouchEvent: true, // No responde al click
        marked: true,            // Muestra un puntito
        dotColor: 'red',         // Color del puntito (ocupado)
        textColor: 'gray'        // Color del texto del día (deshabilitado)
      };
    });

    // Agregamos la selección actual del usuario (si existe)
    if (selected) {
      marks[selected] = {
        ...marks[selected], // Mantenemos propiedades si coincidiera (raro si está disabled)
        selected: true,
        disableTouchEvent: true,
        selectedColor: '#FA812F', // Tu color naranja
        selectedTextColor: 'white'
      };
    }

    return marks;
  }, [reservedDates, selected]);

  const handleDayPress = (day: DateData) => {
    setSelected(day.dateString);
    if (onDateSelect) {
      onDateSelect(day.dateString);
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
      elevation: 3
    }}>
      <Calendar
        // 3. Bloqueamos días anteriores a hoy
        minDate={today}
        
        onDayPress={handleDayPress}
        markedDates={markedDates}
        
        // Personalización visual
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#FA812F',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#FA812F',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8', // Color de días pasados
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