package com.sakti.banking.entity;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="users", uniqueConstraints=@UniqueConstraint(name="uk_users_email",columnNames="email"))
public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=100) private String fullName;
 @Column(nullable=false,unique=true,length=150) private String email;
 @Column(nullable=false) private String password;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Role role=Role.CUSTOMER;
 @Column(nullable=false) private boolean enabled=true;
 @Column(length=20) private String phone; @Column(length=250) private String address; private LocalDate dateOfBirth;
 @Column(length=100) private String nomineeName; @Column(length=40) private String nomineeRelation;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private KycStatus kycStatus=KycStatus.NOT_SUBMITTED;
 @Column(nullable=false,updatable=false) private LocalDateTime createdAt; private LocalDateTime updatedAt;
 @PrePersist void onCreate(){createdAt=LocalDateTime.now();updatedAt=createdAt;} @PreUpdate void onUpdate(){updatedAt=LocalDateTime.now();}
 public Long getId(){return id;} public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getPassword(){return password;} public void setPassword(String v){password=v;}
 public Role getRole(){return role;} public void setRole(Role v){role=v;} public boolean isEnabled(){return enabled;} public void setEnabled(boolean v){enabled=v;}
 public String getPhone(){return phone;} public void setPhone(String v){phone=v;} public String getAddress(){return address;} public void setAddress(String v){address=v;}
 public LocalDate getDateOfBirth(){return dateOfBirth;} public void setDateOfBirth(LocalDate v){dateOfBirth=v;} public String getNomineeName(){return nomineeName;} public void setNomineeName(String v){nomineeName=v;}
 public String getNomineeRelation(){return nomineeRelation;} public void setNomineeRelation(String v){nomineeRelation=v;} public KycStatus getKycStatus(){return kycStatus;} public void setKycStatus(KycStatus v){kycStatus=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
