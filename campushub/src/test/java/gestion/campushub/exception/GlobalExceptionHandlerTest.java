package gestion.campushub.exception;

import gestion.campushub.common.ErreurResponse;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void testEmailDuplique_retourne409() {
        DataIntegrityViolationException ex = new DataIntegrityViolationException(
                "could not execute statement",
                new RuntimeException(
                        "ERROR: duplicate key value violates unique constraint \"uq_etudiant_email\"")
        );

        ResponseEntity<ErreurResponse> reponse = handler.handleIntegrite(ex);

        assertEquals(HttpStatus.CONFLICT, reponse.getStatusCode());
        assertNotNull(reponse.getBody());
        assertEquals(409, reponse.getBody().status());
        assertEquals(
                List.of("Cet email est deja utilise par un autre etudiant"),
                reponse.getBody().erreurs()
        );
    }

    @Test
    void testAutreContrainte_retourne400() {
        DataIntegrityViolationException ex = new DataIntegrityViolationException(
                "could not execute statement",
                new RuntimeException(
                        "ERROR: new row violates check constraint \"etudiant_age_check\"")
        );

        ResponseEntity<ErreurResponse> reponse = handler.handleIntegrite(ex);

        assertEquals(HttpStatus.BAD_REQUEST, reponse.getStatusCode());
        assertNotNull(reponse.getBody());
        assertEquals(400, reponse.getBody().status());
    }
}
