import db from "./db/index.js";
import {
  users,
  complianceCategories,
  complianceControls,
  forms,
  formSections,
  formQuestions,
  questionOptions
} from "./db/schema.js";

async function seed() {
  console.log("Seeding database...");

  /* ========== DEFAULT ADMIN ========== */
  const [admin] = await db.insert(users).values({
    name: "UIDAI Admin",
    email: "admin@uidai.gov.in",
    password: "admin123",
    role: "admin",
    organization: "UIDAI"
  }).returning();
  console.log("Admin created:", admin.userId);

  /* ========== COMPLIANCE CATEGORIES ========== */
  const categoryData = [
    { code: "A", title: "Information Security Governance", sortOrder: 1 },
    { code: "B", title: "Data Privacy", sortOrder: 2 },
    { code: "C", title: "Asset Management", sortOrder: 3 },
    { code: "D", title: "Human Resource Security", sortOrder: 4 },
    { code: "E", title: "Access Control", sortOrder: 5 },
    { code: "F", title: "Physical Security", sortOrder: 6 },
    { code: "G", title: "Data Security", sortOrder: 7 },
    { code: "H", title: "Network Security", sortOrder: 8 },
    { code: "I", title: "Operations Security", sortOrder: 9 },
    { code: "J", title: "Application Security", sortOrder: 10 },
    { code: "K", title: "Logging and Monitoring", sortOrder: 11 },
    { code: "L", title: "Fraud and Forensics", sortOrder: 12 },
  ];

  const categories = await db.insert(complianceCategories).values(categoryData).returning();
  console.log("Categories seeded:", categories.length);

  const catMap = {};
  for (const c of categories) catMap[c.code] = c.categoryId;

  /* ========== ALL 77 COMPLIANCE CONTROLS ========== */
  const controlData = [
    // A — Information Security Governance (1–4)
    { categoryId: catMap["A"], controlNo: 1, shortTitle: "Security organisation and CISO function", description: "AUA/KUA should ensure that it has a designated Chief Information Security Officer (CISO) or equivalent function that oversees information security governance and compliances. The CISO should have independent reporting to its Board or other governing body or chief executive." },
    { categoryId: catMap["A"], controlNo: 2, shortTitle: "Appointment of management and technical single point of contact", description: "AUA/KUA should appoint a Management Single Point of Contact (MPOC) and Technical Single Point of Contact (TPOC) that should oversee the management of the authentication application and Aadhaar related activities. MPOC/TPOC should ensure consistent communication with UIDAI on Aadhaar related requirements and compliances. Any change in MPOC/TPOC should be communicated to UIDAI in a timely manner." },
    { categoryId: catMap["A"], controlNo: 3, shortTitle: "Information security policy and procedure", description: "AUA/KUA should have an information security policy and information security procedures in accordance with industry leading standards, such as ISO27001 (ISMS), NIST Cyber Security Framework, CSA Framework and ISO27701 (PIMS). The entity's information security policy should also address the security aspects of Aadhaar, as provided under the Aadhaar Act, regulations and specifications. Incident management procedure and RCA procedure, Restriction usage of generic IDs." },
    { categoryId: catMap["A"], controlNo: 4, shortTitle: "Aadhaar authentication application design and Service Flow", description: "AUA/KUA should ensure that: a. Authentication application design architecture is documented which covers Aadhaar security requirements. b. Aadhaar data flow is properly documented for its applications." },

    // B — Data Privacy (5–7)
    { categoryId: catMap["B"], controlNo: 5, shortTitle: "Consent of Aadhaar number holder", description: "a) The AUA/KUA should obtain consent of the Aadhaar number holder or, in case of a child, the consent of the parent or legal guardian of such child, before collecting their identity information for the purposes of authentication. The consent should be obtained preferably in electronic form. b) The AUA/KUA should ensure that the consent information is communicated in local language. c) The AUA/KUA should also ensure that, on and from the date of coming into force of sub-section (3) of section 5 of the DPDP Act, the Aadhaar number holder has the option to access the contents of the notice referred to in sub-sections (1) and (2) of the said section and the request for consent referred to in sub-section (3) of section 6 in English or any language specified in the Eighth Schedule to the Constitution." },
    { categoryId: catMap["B"], controlNo: 6, shortTitle: "Information to Aadhaar number holder on the nature of information", description: "At the time of authentication, before obtaining consent, AUA/KUA should inform the Aadhaar number holder or, in case of a child, the parent or legal guardian of such child: a) Nature of information that will be shared by UIDAI upon performance of authentication. b) Uses to which the information received during authentication may be put to by it. c) Alternatives to submission of identity information." },
    { categoryId: catMap["B"], controlNo: 7, shortTitle: "Communication of consent related information to persons with visual/hearing disability", description: "The AUA/KUA should make provisions for communication of consent related information to persons with visual/hearing disability in an appropriate manner." },

    // C — Asset Management (8)
    { categoryId: catMap["C"], controlNo: 8, shortTitle: "End-point security", description: "AUA/KUA should ensure that biometric deploying devices are connected with end-point systems that have the latest operating system (OS) specifications (as of March 2024, at least Windows 10 and above and Android OS 10 and above), and that systems based on an OS that is end-of-life or end-of-support are not deployed or used." },

    // D — Human Resource Security (9)
    { categoryId: catMap["D"], controlNo: 9, shortTitle: "Background verification and signing of confidentiality agreement", description: "AUA/KUA should a) Conduct a background check and sign a confidentiality agreement / non-disclosure agreement (NDA) with all personnel/agency handling Aadhaar related information. Access to authentication infrastructure should not be granted before signing NDA and completion of background verification (BGV) for personnel. b) Take an undertaking from business correspondents (BCs) and similar entities, Sub-AUAs/Sub-KUAs and other third party contractors regarding NDAs and BGVs conducted successfully for their personnel handling Aadhaar related data." },

    // E — Access Control (10–15)
    { categoryId: catMap["E"], controlNo: 10, shortTitle: "Multi-factor authentication of operator", description: "AUA/KUA should ensure in the case of assisted devices and applications where operators need to mandatorily perform application functions, that the operator is authenticated using a multi-factor authentication scheme, such as user id, password, Aadhaar authentication, answer to personal security questions, soft token, hard token, one-time password, voice recognition, biometric data match and PIN." },
    { categoryId: catMap["E"], controlNo: 11, shortTitle: "Access provisioning mechanism", description: "AUA/KUA should ensure that only authorised individuals are able to access information facilities such as the authentication application, audit logs, authentication servers, application, source code, information security infrastructure, etc., and Aadhaar processing related information." },
    { categoryId: catMap["E"], controlNo: 12, shortTitle: "Privilege user access management", description: "AUA/KUA should ensure that systems and procedures are in place for privilege user access management (PAM). Privilege user access should be limited to authorised users only." },
    { categoryId: catMap["E"], controlNo: 13, shortTitle: "Privilege accounts", description: "AUA/KUA should ensure through the PAM tool that privileged accounts, such as NT Authority, Administrator and root accounts, are accessible only to a limited set of users, and that access to privileged account is not allowed to normal users." },
    { categoryId: catMap["E"], controlNo: 14, shortTitle: "Segregation of duties", description: "AUA/KUA should ensure that personnel involved in operational, development or testing functions should not be given additional responsibilities in system administration processes, audit log maintenance, security review of system or processes that may compromise data security. Where segregation of duties is not possible or practicable, the process should include compensating controls, such as monitoring of activities, maintenance and review of audit trails and management supervision." },
    { categoryId: catMap["E"], controlNo: 15, shortTitle: "User account lockout", description: "AUA/KUA should ensure that three successive log-in failures result in the user account being locked. End users / operators should not be able to log in until their account is unlocked and the password is reset." },

    // F — Physical Security (16–24)
    { categoryId: catMap["F"], controlNo: 16, shortTitle: "Physical security of AUA data centre", description: "AUA/KUA data centre hosting Aadhaar related information should be secured fully and should have access control." },
    { categoryId: catMap["F"], controlNo: 17, shortTitle: "Security of AUA servers", description: "AUA/KUA should ensure that their servers are placed in an isolated, secure cabinet in the data centre." },
    { categoryId: catMap["F"], controlNo: 18, shortTitle: "Physical security of AUA/KUA data centre (24x7)", description: "AUA/KUA data centre and servers should be under 24X7 protection of security guards and CCTV surveillance." },
    { categoryId: catMap["F"], controlNo: 19, shortTitle: "Physical security of AUA/KUA data centre (access logs)", description: "AUA/KUA should ensure that access to the data centre is restricted only to authorised individuals and appropriate logs of entry of individuals should be maintained along with the date, time and purpose of entry." },
    { categoryId: catMap["F"], controlNo: 20, shortTitle: "Physical security of AUA/KUA data centre (asset movement)", description: "AUA/KUA should ensure that the movement of all incoming and outgoing assets related to Aadhaar in the AUA/KUA data centre is documented." },
    { categoryId: catMap["F"], controlNo: 21, shortTitle: "Physical security of AUA/KUA data centre (restricted areas)", description: "AUA/KUA should ensure that visible and clearly readable signs/notices notifying areas designated as restricted areas and provisions restricting entry to the same are posted at all points leading to entry to such areas." },
    { categoryId: catMap["F"], controlNo: 22, shortTitle: "Physical security of AUA/KUA data centre (lockable cabinets)", description: "AUA/KUA should provide lockable cabinets or safes in the data centre and information processing facilities for housing servers containing critical Aadhaar related information. AUA/KUA should deploy label, monitor and test regularly the operation of fire exit doors and fire extinguishing systems." },
    { categoryId: catMap["F"], controlNo: 23, shortTitle: "Preventive maintenance activity at data centre", description: "AUA/KUA should ensure that preventive maintenance activities, such as audit of fire extinguishers and CCTV, are carried out on a quarterly basis." },
    { categoryId: catMap["F"], controlNo: 24, shortTitle: "Physical location of AUA/KUA servers", description: "AUA/KUA should ensure that the data centres hosting servers on which Aadhaar related information is stored are within India." },

    // G — Data Security (25–50)
    { categoryId: catMap["G"], controlNo: 25, shortTitle: "PID encryption and biometric data security", description: "AUA/KUA should ensure that biometric data are necessarily encrypted and secured at the time of capture of such information of the Aadhaar number holder, in accordance with such specifications as UIDAI may lay down from time to time." },
    { categoryId: catMap["G"], controlNo: 26, shortTitle: "PID encryption and biometric data security (client packaging)", description: "AUA/KUA should ensure that after collection of requisite demographic and/or biometric information and/or one-time password (OTP) from the Aadhaar number holder, the client application immediately packages and encrypts these input parameters into a PID block, before transmitting the same, and that the same is sent to the server of the AUA/KUA using secure protocols." },
    { categoryId: catMap["G"], controlNo: 27, shortTitle: "PID encryption and biometric data security (AES 256)", description: "AUA/KUA should ensure that the PID block is encrypted with a dynamic session key using AES 256 symmetric algorithm (AES/GCM/No Padding) at the time of capture on the authentication device. The session key should be encrypted with 2048-bit UIDAI public key using asymmetric algorithm (RSA/ECB/PKCS1 Padding). In doing so, AUA/KUA should comply with the latest API specification document issued by UIDAI from time to time." },
    { categoryId: catMap["G"], controlNo: 28, shortTitle: "PID encryption and biometric data security (session key)", description: "AUA/KUA should ensure with respect to the operational details referred to against control number 27, that the session key is not stored anywhere except in the memory and that the same is not reused across transactions. Reuse of session key is allowed only when it is used as seed key while using synchronised session key scheme." },
    { categoryId: catMap["G"], controlNo: 29, shortTitle: "Aadhaar number security", description: "AUA/KUA should ensure that the Aadhaar number / Virtual ID (VID) / ANCS token provided by the Aadhaar number holder for authentication request is not retained by the device operator or within the device or at the AUA/KUA server(s)." },
    { categoryId: catMap["G"], controlNo: 30, shortTitle: "Restriction in storage of Aadhaar number, biometrics and/or eKYC", description: "AUA/KUA should ensure that under no circumstances assisted devices and any application associated with Aadhaar authentication stores the Aadhaar number, biometrics and/or e-KYC of the Aadhaar number holder." },
    { categoryId: catMap["G"], controlNo: 31, shortTitle: "Fingerprint biometric data (FMR and FIR) capture in single PID block", description: "For fingerprint-based biometric authentication devices, AUA/KUA should ensure capture of Finger Minutiae Record (FMR) and Finger Image Record (FIR) in single PID block." },
    { categoryId: catMap["G"], controlNo: 32, shortTitle: "Security of private keys", description: "AUA/KUA should ensure that the private key used for digitally signing the authentication request and the licence keys are kept secure and the access to the same is controlled, and that the private key meets such parameters as UIDAI may specify from time to time in the Aadhaar Authentication API Specification document issued by it." },
    { categoryId: catMap["G"], controlNo: 33, shortTitle: "Use of HSM", description: "AUA/KUA should ensure that key(s) used for digitally signing authentication requests and decrypting e-KYC XML responses are stored only in the Hardware Security Module (HSM), which should be compliant with the latest FIPS 140 standard. AUA/KUA should comply with all the requirements of UIDAI circular no. K 11020/204/2017-UIDAI (Auth-I), dated 22.6.2017 (Implementation of HSM by Entity/ASA)." },
    { categoryId: catMap["G"], controlNo: 34, shortTitle: "Use of HSM (dedicated on-premise)", description: "AUA/KUA should have a dedicated, on-premise, HSM set up for the management of security/encryption keys, and should not share the same with any other entity." },
    { categoryId: catMap["G"], controlNo: 35, shortTitle: "Use of ADV", description: "An AUA/KUA and any other entity which is allowed to store Aadhaar number should collect and store Aadhaar number and any connected data only in a separate, secure database/vault/system, termed as Aadhaar Data Vault (ADV). Such AUA/KUA should ensure that each Aadhaar number is referred to by an additional key, called as reference key, and that mapping of the reference key and Aadhaar number is maintained in ADV." },
    { categoryId: catMap["G"], controlNo: 36, shortTitle: "Use of Aadhaar data vault (ADV) on cloud", description: "AUA/KUA should ensure that if ADV is hosted on cloud, the ADV cloud service complies with UIDAI's Guidelines for ADV on Cloud. The ADV should be hosted only by Government Community Cloud (GCC) service providers, recognised as such by the Ministry of Electronics and Information Technology." },
    { categoryId: catMap["G"], controlNo: 37, shortTitle: "Use of Aadhaar data vault (ADV) on cloud (SOC2 Type2)", description: "AUA/KUA having ADV on cloud should get annual SOC2 Type2 examination performed for cloud hosting service. Management review should be performed for non-compliant / qualified controls reported in the SOC2 Type2 reports." },
    { categoryId: catMap["G"], controlNo: 38, shortTitle: "Use of ADV (single logical instance)", description: "AUA/KUA should ensure that Aadhaar numbers along with connected data (such as eKYC XML containing Aadhaar numbers and demographic data), if any, is stored only in a single logical instance of ADV, along with corresponding reference key. AUA/KUA should ensure that appropriate High Availability and Disaster Recovery provisions are made for the vault, with the same level of security." },
    { categoryId: catMap["G"], controlNo: 39, shortTitle: "Use of ADV (trusted communications)", description: "AUA/KUA should ensure that only trusted communications are permitted in and out of the vault; this should ideally be done through APIs/microservices dedicated to obtain the mapping and controlling the access to the APIs/microservices at the application level. AUA/KUA should ensure that any authorised users needing to access such mapping necessarily go through the application for viewing/accessing the data, after appropriate user authentication, authorisation and logging." },
    { categoryId: catMap["G"], controlNo: 40, shortTitle: "Use of ADV (access controls and monitoring)", description: "AUA/KUA should ensure that strong access controls, authentication measures, monitoring and logging of access and raising of necessary alerts for unusual and/or unauthorised attempts to access ADV are implemented." },
    { categoryId: catMap["G"], controlNo: 41, shortTitle: "End-point security (USB restriction)", description: "AUA/KUA should ensure that USB access on the servers and endpoints is, in the default, restricted for all, and the same is allowed only on approval basis." },
    { categoryId: catMap["G"], controlNo: 42, shortTitle: "End-point security — antivirus / anti-malware", description: "AUA/KUA should use licensed malware and antivirus solution (preferably Next-Generation antivirus) to protect against malware. The malware/antivirus installed should be configured to update in real time." },
    { categoryId: catMap["G"], controlNo: 43, shortTitle: "Aadhaar information security — Physical Aadhaar documents", description: "AUA/KUA should mask Aadhaar numbers collected through physical forms or photocopies of Aadhaar letters, by masking the first eight digits of the Aadhaar number, before storing physical copies." },
    { categoryId: catMap["G"], controlNo: 44, shortTitle: "Use of security communication protocols", description: "AUA/KUA and ASA should ensure message security and integrity between their servers and those of third party entities, such as Sub-AUAs and Sub-KUAs. AUA/KUA should procure digital certificate from a Certifying Authority as defined in the IT Act." },
    { categoryId: catMap["G"], controlNo: 45, shortTitle: "Restriction on display/publishing of identity information", description: "a) AUA/KUA, Sub-AUAs, Sub-KUAs, Business Correspondents and other sub-contractors performing Aadhaar authentication should ensure that identity information is not displayed or disclosed to external agencies or unauthorised persons. b) AUA/KUA should not publish any personal identifiable data including Aadhaar in public domain/websites etc. c) AUA/KUA should ensure that display of full Aadhaar number is controlled only for the Aadhaar number holder or for such special roles/users of AUA/KUA as have functional necessity for the same; by default, all other display should be masked such that only the last four digits of the Aadhaar number are displayed." },
    { categoryId: catMap["G"], controlNo: 46, shortTitle: "End-point security (session timeout)", description: "AUA/KUA should ensure that end-point devices used for developing, process and handling Aadhaar data and application timeout after a session is idle for more than 30 to 15 minutes, based on the criticality of the application." },
    { categoryId: catMap["G"], controlNo: 47, shortTitle: "Secure software development", description: "AUA/KUA should implement system and processes to ensure secure software development practices. Periodic training of developers should be conducted on secure software development practices. Records of such trainings should be maintained." },
    { categoryId: catMap["G"], controlNo: 48, shortTitle: "Restriction in local storage of Aadhaar data / PII information", description: "AUA/KUA should ensure that there is no local storage of Aadhaar number or VID or the PID block on the system, volatile memory or the database. In case of a mobile application, AUA/KUA should ensure that there is no local storage of Aadhaar number or the PID block in the shared preference folder." },
    { categoryId: catMap["G"], controlNo: 49, shortTitle: "Encryption of stored eKYC data", description: "AUA/KUA should ensure that e-KYC data is stored in an encrypted manner in database tables." },
    { categoryId: catMap["G"], controlNo: 50, shortTitle: "Patch management", description: "AUA/KUA should ensure that the patch management process is implemented for applying patches to information systems. Patches should be updated at both the application and the server and network levels. AUA/KUA should ensure that either N or N-1 patches are maintained." },

    // H — Network Security (51–56)
    { categoryId: catMap["H"], controlNo: 51, shortTitle: "Network connectivity with ASA", description: "AUA/KUA should establish secure network connectivity between AUA/KUA and its Sub-AUAs, Sub-KUAs, sub-contractors and ASAs, and should connect with ASAs only through secure leased lines or similar secure private lines. If a public network is used, only a secure channel should be used." },
    { categoryId: catMap["H"], controlNo: 52, shortTitle: "Segregation of AUA servers network", description: "AUA/KUA should ensure that its servers reside in a segregated network segment isolated from the rest of the network of the AUA/KUA organisation. The AUA/KUA servers should be dedicated for online Aadhaar authentication purposes and should not be used for any other activities not related to Aadhaar." },
    { categoryId: catMap["H"], controlNo: 53, shortTitle: "Firewall access of network", description: "AUA/KUA should ensure that authentication application servers and infrastructure are hosted behind a firewall and that firewall rules block incoming access requests to the AUA/KUA server from all sources other than whitelisted IP addresses/zones." },
    { categoryId: catMap["H"], controlNo: 54, shortTitle: "NIPS/IDS implementation", description: "AUA/KUA should ensure that network intrusion and prevention systems (NIPS) and intrusion detection system (IDS) are implemented to safeguard the network from external attacks / DDoS attacks." },
    { categoryId: catMap["H"], controlNo: 55, shortTitle: "Network security (internet access restriction)", description: "AUA/KUA should ensure that Internet access on systems are restricted to necessary or work-related websites and that access to web portals known for pirated software, gambling etc. are restricted." },
    { categoryId: catMap["H"], controlNo: 56, shortTitle: "Encryption of data on network", description: "AUA/KUA should ensure that transmission of Aadhaar number across open, public networks is always encrypted, using the latest version of Transport Layer Security (TLS) configuration." },

    // I — Operations Security (57–66)
    { categoryId: catMap["I"], controlNo: 57, shortTitle: "Segregation of testing and production environments", description: "AUA/KUA should ensure that the testing and production facilities/environments are physically and/or logically separated. AUA/KUA should ensure that authentication application testing utilises test data / non-production data and that Aadhaar number holder's identity data are not used for testing the application." },
    { categoryId: catMap["I"], controlNo: 58, shortTitle: "Restrictions on designing/compiling malicious code", description: "AUA/KUA personnel should not intentionally write, generate, compile, copy or attempt to introduce any computer code designed to damage or otherwise hinder the performance of, or access to, any Aadhaar information." },
    { categoryId: catMap["I"], controlNo: 59, shortTitle: "License key / encryption keys security", description: "AUA/KUA should ensure that license keys are kept secure and access controlled, and that separate license keys are generated for their Sub-AUAs and Sub-KUAs from UIDAI's portal and kept secure and access to the same kept controlled." },
    { categoryId: catMap["I"], controlNo: 60, shortTitle: "Implementation of Virtual ID", description: "AUA/KUA must provide in their authentication application the option for an Aadhaar number holder to use a Virtual ID (VID) for authentication, in place of their Aadhaar number." },
    { categoryId: catMap["I"], controlNo: 61, shortTitle: "UID Token", description: "AUA/KUA should make provision to store UID tokens in their database." },
    { categoryId: catMap["I"], controlNo: 62, shortTitle: "Restriction on the use of Aadhaar as domain-specific identifier", description: "AUA/KUA should ensure that Aadhaar number and VID are never used as domain-specific identifiers and that domain-specific identifiers are revoked and/or reissued. For example, instead of using Aadhaar number as bank customer ID or license number or student ID etc., a local, domain-specific identifier mapped in the back-end database should be used." },
    { categoryId: catMap["I"], controlNo: 63, shortTitle: "Unique device code of each device", description: "AUA/KUA should ensure that each authentication device has a unique device code and that a unique transaction number is automatically generated by the authentication device and incremented for each transaction processed." },
    { categoryId: catMap["I"], controlNo: 64, shortTitle: "Back-up / alternative identity authentication mechanism", description: "AUA/KUA should implement exception-handling mechanisms and back-up identity authentication mechanisms to ensure seamless provision of authentication delivery of services to Aadhaar number holders." },
    { categoryId: catMap["I"], controlNo: 65, shortTitle: "Notification to Aadhaar number holders", description: "AUA/KUA should notify the Aadhaar number holder of the success or failure of each authentication request, through email and/or SMS. Such notification should include the name of the requesting entity, the date and time of authentication, the authentication response code (in case of online authentication), the last four digits of the Aadhaar number and the purpose of authentication, as the case may be. In case of authentication failure, the AUA/KUA should, in clear and precise language, inform the Aadhaar number holder of the reasons of authentication failure." },
    { categoryId: catMap["I"], controlNo: 66, shortTitle: "Establishment of grievance handling mechanism", description: "AUA/KUA should have an effective grievance handling mechanism and provide the same through multiple channels." },

    // J — Application Security (67–72)
    { categoryId: catMap["J"], controlNo: 67, shortTitle: "API whitelisting and API gateway implementation", description: "AUA/KUA should ensure that it has API whitelist implemented to limit the data exchange using only authorised APIs and with whitelisted IP addresses. AUA/KUA should also ensure that API gateway is deployed for centralised security enforcement, monitoring and management. AUA/KUA should ensure that rate limitation and throttling mechanisms are implemented to prevent abuse of API and Distributed Denial of Service (DDoS) attacks. AUA/KUA should ensure that Cross-Origin Resource Sharing (CORS) parameters are configured to restrict unauthorised domains from accessing APIs from the client side." },
    { categoryId: catMap["J"], controlNo: 68, shortTitle: "Source code review by CERT-In empanelled auditor", description: "AUA/KUA should perform source code review of the modules and applications used for authentication and e-KYC and undergo audit by a CERT-In-empanelled auditor." },
    { categoryId: catMap["J"], controlNo: 69, shortTitle: "SAST/DAST application audit", description: "AUA/KUA should ensure that authentication application security assessment (including static application security testing (SAST) and dynamic application security testing (DAST)) is performed at least annually or at the time of major changes to the authentication application, and that all vulnerabilities are addressed for remediation and no vulnerable third party components are used by the authentication application." },
    { categoryId: catMap["J"], controlNo: 70, shortTitle: "Vulnerability assessment", description: "AUA/KUA should plan organisation information security policy, inclusive of vulnerability assessment and penetration testing on its network, infrastructure and applications." },
    { categoryId: catMap["J"], controlNo: 71, shortTitle: "Configuration reviews and system walkthrough", description: "AUA/KUA should ensure that authentication applications are integrated with IDAM, PIM/PAM and SIEM." },
    { categoryId: catMap["J"], controlNo: 72, shortTitle: "Application code review", description: "AUA/KUA should ensure that the passwords, tokens, security keys and licenses are not hardcoded in the application code." },

    // K — Logging and Monitoring (73–76)
    { categoryId: catMap["K"], controlNo: 73, shortTitle: "Authentication log maintenance", description: "AUA/KUA should maintain logs of the authentication transactions processed by it, which should contain the following transaction details: (a) specified parameters of authentication request submitted; (b) specified parameters received as authentication response; (c) the record of disclosure of information to the Aadhaar number holder at the time of authentication; and (d) record of consent of the Aadhaar number holder for authentication, but shall not, in any event, retain the PID information, Aadhaar number / VID." },
    { categoryId: catMap["K"], controlNo: 74, shortTitle: "Security incident recording", description: "AUA/KUA should ensure that the event/security logs recording critical user-activities, exceptions and security events are enabled and stored to assist any future investigation and enable access control monitoring." },
    { categoryId: catMap["K"], controlNo: 75, shortTitle: "Security incident monitoring", description: "AUA/KUA should ensure that regular monitoring of event/security logs takes place to detect unauthorised use of information systems and that results of the same are recorded. Further, access to audit trails and event logs should be provided to authorised personnel only." },
    { categoryId: catMap["K"], controlNo: 76, shortTitle: "Clock synchronisation through use of Network Time Protocol (NTP)", description: "AUA/KUA should connect to the Network Time Protocol (NTP) server of the National Informatics Centre (NIC) or National Physical Laboratory (NPL), or with NTP servers traceable to the said NTP servers, for synchronisation of all their ICT systems clocks. Entities having ICT infrastructure spanning multiple geographies may also use accurate and standard time source other than NPL and NIC; however, it should be ensured that such time source does not deviate from NPL and NIC." },

    // L — Fraud and Forensics (77)
    { categoryId: catMap["L"], controlNo: 77, shortTitle: "Fraud analytics module", description: "AUA/KUA should deploy, as part of its systems, a fraud analytics module that is capable of analysing authentication related transactions to identify fraud." },
  ];

  await db.insert(complianceControls).values(controlData);
  console.log("Controls seeded:", controlData.length);

  /* ========== APPLICATION FORM (kept from original) ========== */
  const [form] = await db.insert(forms).values({
    title: "AUA/KUA Application Form",
    description: "UIDAI Authentication Application"
  }).returning();

  const [section] = await db.insert(formSections).values({
    formId: form.formId,
    title: "Applicant Details",
    order: 1
  }).returning();

  const questions = await db.insert(formQuestions).values([
    { sectionId: section.sectionId, questionText: "Applicant Name", fieldType: "text", isRequired: true, order: 1 },
    { sectionId: section.sectionId, questionText: "Registration / Incorporation Number", fieldType: "text", order: 2 },
    { sectionId: section.sectionId, questionText: "License Number", fieldType: "text", order: 3 },
    { sectionId: section.sectionId, questionText: "Registered Office Address", fieldType: "textarea", isRequired: true, order: 4 },
    { sectionId: section.sectionId, questionText: "Correspondence Address", fieldType: "textarea", order: 5 },
    { sectionId: section.sectionId, questionText: "GSTN", fieldType: "text", order: 6 },
    { sectionId: section.sectionId, questionText: "TAN", fieldType: "text", order: 7 },
    { sectionId: section.sectionId, questionText: "Type of facility", fieldType: "checkbox", isRequired: true, order: 8 },
    { sectionId: section.sectionId, questionText: "Applicable Provision of Aadhaar Act", fieldType: "radio", order: 9 },
    { sectionId: section.sectionId, questionText: "Category of Applicant", fieldType: "dropdown", order: 10 }
  ]).returning();

  const facilityQuestion = questions.find(q => q.questionText === "Type of facility");
  await db.insert(questionOptions).values([
    { questionId: facilityQuestion.questionId, optionText: "AUA", order: 1 },
    { questionId: facilityQuestion.questionId, optionText: "KUA", order: 2 }
  ]);

  const aadhaarQuestion = questions.find(q => q.questionText === "Applicable Provision of Aadhaar Act");
  await db.insert(questionOptions).values([
    { questionId: aadhaarQuestion.questionId, optionText: "Section 7", order: 1 },
    { questionId: aadhaarQuestion.questionId, optionText: "Section 4(4)(b)(i) read with PMLA", order: 2 },
    { questionId: aadhaarQuestion.questionId, optionText: "Section 4(4)(b)(i) read with other Central Act", order: 3 },
    { questionId: aadhaarQuestion.questionId, optionText: "Section 4(4)(b)(ii)", order: 4 },
    { questionId: aadhaarQuestion.questionId, optionText: "Section 4(7)", order: 5 }
  ]);

  console.log("Application form seeded");
  console.log("✅ Seed complete!");
}

seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });