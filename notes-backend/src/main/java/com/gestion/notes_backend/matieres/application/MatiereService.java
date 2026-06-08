package com.gestion.notes_backend.matieres.application;

import com.gestion.notes_backend.matieres.application.dto.MatiereRequest;
import com.gestion.notes_backend.matieres.application.dto.MatiereResponse;
import com.gestion.notes_backend.matieres.domain.Coefficient;
import com.gestion.notes_backend.matieres.domain.Matiere;
import com.gestion.notes_backend.matieres.domain.MatiereRepository;
import com.gestion.notes_backend.shared.exceptions.BusinessException;
import com.gestion.notes_backend.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatiereService {

    private final MatiereRepository matiereRepository;

    @Transactional
    public MatiereResponse create(MatiereRequest request) {
        if (matiereRepository.existsByCode(request.code())) {
            throw new BusinessException("Code matière déjà utilisé : " + request.code());
        }
        Matiere matiere = Matiere.builder()
                .nom(request.nom())
                .code(request.code().toUpperCase())
                .coefficient(Coefficient.of(request.coefficient()))
                .semestre(request.semestre())
                .classeId(request.classeId())
                .build();
        return MatiereResponse.from(matiereRepository.save(matiere));
    }

    public List<MatiereResponse> findByClasse(Long classeId) {
        return matiereRepository.findByClasseId(classeId)
                .stream()
                .map(MatiereResponse::from)
                .toList();
    }

    public List<MatiereResponse> findByClasseAndSemestre(Long classeId, Integer semestre) {
        return matiereRepository.findByClasseIdAndSemestre(classeId, semestre)
                .stream()
                .map(MatiereResponse::from)
                .toList();
    }

    public MatiereResponse findById(Long id) {
        return matiereRepository.findById(id)
                .map(MatiereResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Matière introuvable : " + id));
    }

    @Transactional
    public MatiereResponse update(Long id, MatiereRequest request) {
        Matiere matiere = matiereRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matière introuvable : " + id));
        matiere.setNom(request.nom());
        matiere.setCode(request.code().toUpperCase());
        matiere.setCoefficient(Coefficient.of(request.coefficient()));
        matiere.setSemestre(request.semestre());
        matiere.setClasseId(request.classeId());
        return MatiereResponse.from(matiereRepository.save(matiere));
    }

    @Transactional
    public void delete(Long id) {
        if (matiereRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Matière introuvable : " + id);
        }
        matiereRepository.deleteById(id);
    }
}