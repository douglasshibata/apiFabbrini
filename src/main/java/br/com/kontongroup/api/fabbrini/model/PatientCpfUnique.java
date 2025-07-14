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
 * Validate that the cpf value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = PatientCpfUnique.PatientCpfUniqueValidator.class
)
public @interface PatientCpfUnique {

    String message() default "{Exists.patient.cpf}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class PatientCpfUniqueValidator implements ConstraintValidator<PatientCpfUnique, String> {

        private final PatientService patientService;
        private final HttpServletRequest request;

        public PatientCpfUniqueValidator(final PatientService patientService,
                final HttpServletRequest request) {
            this.patientService = patientService;
            this.request = request;
        }

        @Override
        public boolean isValid(final String value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("id");
            if (currentId != null && value.equalsIgnoreCase(patientService.get(Long.parseLong(currentId)).getCpf())) {
                // value hasn't changed
                return true;
            }
            return !patientService.cpfExists(value);
        }

    }

}
