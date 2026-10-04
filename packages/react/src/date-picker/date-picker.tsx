'use client';

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from '@robin-dot-lab/icons';
import type { ReactNode } from 'react';
import {
  Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker as AriaDatePicker, DateSegment, Dialog, FieldError,
  Group, Heading, Label, Popover, Text,
  type DatePickerProps as AriaDatePickerProps, type DateValue,
} from 'react-aria-components';
import { cn } from '../lib/cn.js';

export interface DatePickerProps<T extends DateValue> extends Omit<AriaDatePickerProps<T>, 'children' | 'className' | 'style'> {
  label: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  className?: string;
}

/**
 * Segment order, month names and the calendar's own labels follow React Aria's locale (`I18nProvider`).
 * A date typed segment by segment (day, month, year: arrows change the focused one) or picked in a
 * calendar. Values are `CalendarDate`s from @internationalized/date (`parseDate('2026-04-27')`, re-exported).
 */
export function DatePicker<T extends DateValue>({ label, description, errorMessage, className, ...props }: DatePickerProps<T>) {
  return (
    <AriaDatePicker className={cn('nl-date-picker', className)} isInvalid={errorMessage != null || undefined} {...props}>
      <Label className="nl-label">{label}</Label>
      <Group className="nl-input nl-date-field">
        <DateInput className="nl-date-input">{(segment) => <DateSegment segment={segment} className="nl-date-segment" />}</DateInput>
        <Button className="nl-field-button"><CalendarIcon /></Button>
      </Group>
      {description != null && errorMessage == null && <Text slot="description" className="nl-help">{description}</Text>}
      <FieldError className="nl-help nl-help--error">{errorMessage}</FieldError>
      <Popover className="nl-popover" offset={6} placement="bottom start">
        <Dialog className="nl-popover__dialog">
          <Calendar className="nl-calendar">
            <header className="nl-calendar__head">
              <Button slot="previous" className="nl-calendar__nav"><ChevronLeft /></Button>
              <Heading className="nl-calendar__title" />
              <Button slot="next" className="nl-calendar__nav"><ChevronRight /></Button>
            </header>
            <CalendarGrid className="nl-calendar__grid">{(date) => <CalendarCell date={date} className="nl-calendar__cell" />}</CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
