package com.sakti.banking.dto;

import com.sakti.banking.entity.BankTransaction;
import com.sakti.banking.entity.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(Long id, String reference, TransactionType type, BigDecimal amount,
                                  BigDecimal balanceAfter, String description, String accountNumber,
                                  String counterpartyAccount, LocalDateTime createdAt) {
    public static TransactionResponse from(BankTransaction tx) {
        return new TransactionResponse(tx.getId(), tx.getReference(), tx.getType(), tx.getAmount(),
                tx.getBalanceAfter(), tx.getDescription(), tx.getAccount().getAccountNumber(),
                tx.getCounterpartyAccount(), tx.getCreatedAt());
    }
}
