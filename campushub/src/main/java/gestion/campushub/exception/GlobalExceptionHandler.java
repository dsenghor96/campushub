package gestion.campushub.exception;

import gestion.campushub.common.ErreurResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErreurResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> erreurs = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + " : " + f.getDefaultMessage())
                .toList();
        return ResponseEntity.badRequest()
                .body(new ErreurResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(), erreurs));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErreurResponse> handleIntegrite(DataIntegrityViolationException ex) {
        String cause = ex.getMostSpecificCause().getMessage();
        boolean emailDuplique = cause != null && cause.contains("uq_etudiant_email");

        HttpStatus status = emailDuplique ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
        String message = emailDuplique
                ? "Cet email est deja utilise par un autre etudiant"
                : "La requete viole une contrainte d'integrite des donnees";

        return ResponseEntity.status(status)
                .body(new ErreurResponse(LocalDateTime.now(), status.value(), List.of(message)));
    }
}
