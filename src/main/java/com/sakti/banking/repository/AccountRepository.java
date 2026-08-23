package com.sakti.banking.repository;
import com.sakti.banking.entity.*; import org.springframework.data.jpa.repository.*; import jakarta.persistence.LockModeType; import java.util.*;
public interface AccountRepository extends JpaRepository<BankAccount,Long>{ Optional<BankAccount> findByAccountNumber(String n); List<BankAccount> findByOwnerEmailIgnoreCase(String e); boolean existsByOwnerIdAndAccountTypeAndStatusNot(Long ownerId,AccountType type,AccountStatus status); @Lock(LockModeType.PESSIMISTIC_WRITE) Optional<BankAccount> findWithLockByAccountNumber(String n); }
