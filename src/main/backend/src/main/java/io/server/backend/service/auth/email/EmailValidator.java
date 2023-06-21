package io.server.backend.service.auth.email;

import org.springframework.stereotype.Service;

import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmailValidator implements Predicate<String> {
    private static final String EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$";

    @Override
    public boolean test(String s) {
        if (s == null) {
            return false;
        }

        Pattern pattern = Pattern.compile(EMAIL_REGEX,
                Pattern.CASE_INSENSITIVE);

        Matcher matcher = pattern.matcher(s);

        return matcher.matches();
    }
}
