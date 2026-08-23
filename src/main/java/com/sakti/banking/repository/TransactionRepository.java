package com.sakti.banking.repository;

import com.sakti.banking.entity.BankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<BankTransaction, Long> {
    List<BankTransaction> findByAccountAccountNumberOrderByCreatedAtDesc(String accountNumber);
}
