package br.com.kontongroup.api.fabbrini.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import br.com.kontongroup.api.fabbrini.service.PatientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Map;
import org.springframework.web.servlet.HandlerMapping;


/**
 * Validate that the id value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = PatientUserUnique.PatientUserUniqueValidator.class
)
public @interface PatientUserUnique {

    String message() default "{Exists.patient.user}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class PatientUserUniqueValidator implements ConstraintValidator<PatientUserUnique, Long> {

        private final PatientService patientService;
        private final HttpServletRequest request;

        public PatientUserUniqueValidator(final PatientService patientService,
                final HttpServletRequest request) {
            this.patientService = patientService;
            this.request = request;
        }

        @Override
        public boolean isValid(final Long value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("id");
            if (currentId != null && value.equals(patientService.get(Long.parseLong(currentId)).getUser())) {
                // value hasn't changed
                return true;
            }
            return !patientService.userExists(value);
        }

    }

}
