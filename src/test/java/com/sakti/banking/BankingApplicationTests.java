package com.sakti.banking;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.profiles.active=h2")
class BankingApplicationTests {
    @Test
    void contextLoads() {}
}
