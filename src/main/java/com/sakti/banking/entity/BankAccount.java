package com.sakti.banking.entity;
import jakarta.persistence.*; import java.math.*; import java.time.*;
@Entity @Table(name="accounts", uniqueConstraints={@UniqueConstraint(name="uk_accounts_number",columnNames="accountNumber"),@UniqueConstraint(name="uk_owner_type",columnNames={"user_id","accountType"})})
public class BankAccount {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true,length=20) private String accountNumber;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private AccountType accountType;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private AccountStatus status=AccountStatus.ACTIVE;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal balance=BigDecimal.ZERO;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private AppUser owner;
 @Version private Long version; @Column(nullable=false,updatable=false) private LocalDateTime createdAt; private LocalDateTime closedAt;
 @PrePersist void onCreate(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;} public String getAccountNumber(){return accountNumber;} public void setAccountNumber(String v){accountNumber=v;}
 public AccountType getAccountType(){return accountType;} public void setAccountType(AccountType v){accountType=v;} public AccountStatus getStatus(){return status;} public void setStatus(AccountStatus v){status=v;}
 public BigDecimal getBalance(){return balance;} public void setBalance(BigDecimal v){balance=v;} public AppUser getOwner(){return owner;} public void setOwner(AppUser v){owner=v;}
 public Long getVersion(){return version;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getClosedAt(){return closedAt;} public void setClosedAt(LocalDateTime v){closedAt=v;}
}
