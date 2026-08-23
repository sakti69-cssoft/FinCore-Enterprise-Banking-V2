package com.sakti.banking.dto;

import com.sakti.banking.entity.AccountType;
import jakarta.validation.constraints.NotNull;

public record CreateAccountRequest(@NotNull AccountType accountType) {}
