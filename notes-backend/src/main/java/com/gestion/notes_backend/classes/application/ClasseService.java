package com.gestion.notes_backend.classes.application;

import com.gestion.notes_backend.classes.application.dto.ClasseRequest;
import com.gestion.notes_backend.classes.application.dto.ClasseResponse;
import com.gestion.notes_backend.classes.domain.Classe;
import com.gestion.notes_backend.classes.domain.ClasseRepository;
import com.gestion.notes_backend.shared.exceptions.BusinessException;
import com.gestion.notes_backend.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClasseService {

    private final ClasseRepository classeRepository;

    public ClasseService(ClasseRepository classeRepository) {
        this.classeRepository = classeRepository;
    }

    @Transactional
    public ClasseResponse create(ClasseRequest request) {
        if (classeRepository.existsByNom(request.nom())) {
            throw new BusinessException("Une classe avec ce nom existe déjà");
        }
        Classe classe = new Classe();
        classe.setNom(request.nom());
        classe.setNiveau(request.niveau());
        classe.setAnnee(request.annee());
        return ClasseResponse.from(classeRepository.save(classe));
    }

    public List<ClasseResponse> findAll() {
        return classeRepository.findAll()
                .stream()
                .map(ClasseResponse::from)
                .toList();
    }

    public ClasseResponse findById(Long id) {
        return classeRepository.findById(id)
                .map(ClasseResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable : " + id));
    }

    public List<ClasseResponse> findByEnseignant(Long enseignantId) {
        return classeRepository.findByEnseignantIdsContaining(enseignantId)
                .stream()
                .map(ClasseResponse::from)
                .toList();
    }

    public List<ClasseResponse> findByEtudiant(Long etudiantId) {
        return classeRepository.findByEtudiantIdsContaining(etudiantId)
                .stream()
                .map(ClasseResponse::from)
                .toList();
    }

    @Transactional
    public ClasseResponse update(Long id, ClasseRequest request) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable : " + id));
        classe.setNom(request.nom());
        classe.setNiveau(request.niveau());
        classe.setAnnee(request.annee());
        return ClasseResponse.from(classeRepository.save(classe));
    }

    @Transactional
    public ClasseResponse ajouterEnseignant(Long classeId, Long enseignantId) {
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable : " + classeId));
        classe.getEnseignantIds().add(enseignantId);
        return ClasseResponse.from(classeRepository.save(classe));
    }

    @Transactional
    public ClasseResponse ajouterEtudiant(Long classeId, Long etudiantId) {
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable : " + classeId));
        classe.getEtudiantIds().add(etudiantId);
        return ClasseResponse.from(classeRepository.save(classe));
    }

    @Transactional
    public void delete(Long id) {
        if (classeRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Classe introuvable : " + id);
        }
        classeRepository.deleteById(id);
    }
}