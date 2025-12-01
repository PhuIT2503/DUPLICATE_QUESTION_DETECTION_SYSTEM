package com.uth.qbca.service;

import com.uth.qbca.model.CLO;
import com.uth.qbca.repository.CLORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CLOService {
    @Autowired
    private CLORepository cloRepository;

    public List<CLO> getAllCLOs() {
        return cloRepository.findAll();
    }

    public Optional<CLO> getCLOById(Long id) {
        return cloRepository.findById(id);
    }

    public CLO saveCLO(CLO clo) {
        return cloRepository.save(clo);
    }

    public void deleteCLO(Long id) {
        cloRepository.deleteById(id);
    }
}
