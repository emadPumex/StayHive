package com.stayhive.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Date;

/**
 * Registers custom MongoDB converters for java.time.LocalDate.
 *
 * Without this, Spring Data MongoDB converts LocalDate through java.util.Date
 * using the JVM's default timezone. On a UTC+5:30 (IST) machine, midnight local
 * time is 18:30 UTC the previous day — causing an off-by-one day bug when storing
 * and reading dates (e.g. June 26 gets stored as June 25T18:30:00Z).
 *
 * These converters always anchor to UTC so that "2026-06-26" is stored as
 * 2026-06-26T00:00:00.000Z and read back exactly as 2026-06-26, regardless
 * of the server's local timezone.
 */
@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(Arrays.asList(
                new LocalDateToDateConverter(),
                new DateToLocalDateConverter()
        ));
    }


    @WritingConverter
    static class LocalDateToDateConverter implements Converter<LocalDate, Date> {
        @Override
        public Date convert(LocalDate source) {
            return Date.from(source.atStartOfDay(ZoneOffset.UTC).toInstant());
        }
    }


    @ReadingConverter
    static class DateToLocalDateConverter implements Converter<Date, LocalDate> {
        @Override
        public LocalDate convert(Date source) {
            return source.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
        }
    }
}
