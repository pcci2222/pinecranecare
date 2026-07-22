import React, { useState, useEffect, useRef } from "react";

// ---------- Design tokens ----------
const T = {
  ink: "#22403A",        // deep pine — headings, text
  inkSoft: "#5A6E69",    // muted text
  surface: "#F4F6F2",    // soft sage-white page background
  card: "#FFFFFF",
  primary: "#2E6E5E",    // teal-green — buttons, brand
  primaryDark: "#245548",
  amber: "#E8A83E",      // warm amber — highlights, badges
  line: "#DDE4DF",
  danger: "#B4533A",
};

const SERVICE_GROUPS = [
  ["grpSenior", ["Personal care", "Companionship", "Meal preparation", "Medication reminders", "Mobility assistance", "Dementia care"]],
  ["grpChild", ["Child care", "Infant care", "After-school care", "Special needs care"]],
  ["grpHome", ["Light housekeeping", "Laundry", "Errands & shopping", "Transportation", "Pet care"]],
  ["grpExtended", ["Post-surgery care", "Overnight care", "Live-in care", "Respite care"]],
];
const SERVICES = SERVICE_GROUPS.flatMap(([, items]) => items);

const CERTS = ["HHA", "CNA", "CPR / First Aid", "Dementia care training"];

const LANGUAGES = [
  "English", "Mandarin", "Cantonese", "Fujianese", "Taishanese", "Shanghainese",
  "Spanish", "Korean", "Russian", "Polish", "Haitian Creole", "Tagalog", "Vietnamese", "Bengali",
];

// v3.9 — NYC metro ZIP centroids for radius search.
// Covers Manhattan, Bronx, Brooklyn, Queens, Staten Island, Nassau, Suffolk (west),
// and the northern-NJ Chinese/Korean corridor. Aides whose ZIP isn't in this table
// fall back to non-radius search (still shown by exact ZIP or city text match).
const ZIP_COORDS = {
  // Manhattan
  "10001":[40.7506,-73.9971],"10002":[40.7157,-73.9862],"10003":[40.7317,-73.9891],"10004":[40.6892,-74.0170],
  "10005":[40.7060,-74.0087],"10006":[40.7091,-74.0132],"10007":[40.7139,-74.0071],"10009":[40.7266,-73.9787],
  "10010":[40.7388,-73.9822],"10011":[40.7406,-74.0002],"10012":[40.7256,-73.9987],"10013":[40.7207,-74.0043],
  "10014":[40.7340,-74.0060],"10016":[40.7448,-73.9784],"10017":[40.7519,-73.9722],"10018":[40.7549,-73.9926],
  "10019":[40.7657,-73.9860],"10020":[40.7590,-73.9789],"10021":[40.7691,-73.9598],"10022":[40.7587,-73.9689],
  "10023":[40.7756,-73.9819],"10024":[40.7860,-73.9760],"10025":[40.7982,-73.9683],"10026":[40.8025,-73.9524],
  "10027":[40.8118,-73.9532],"10028":[40.7761,-73.9535],"10029":[40.7911,-73.9440],"10030":[40.8180,-73.9432],
  "10031":[40.8256,-73.9491],"10032":[40.8388,-73.9427],"10033":[40.8500,-73.9349],"10034":[40.8676,-73.9209],
  "10035":[40.7955,-73.9295],"10036":[40.7599,-73.9902],"10037":[40.8134,-73.9375],"10038":[40.7093,-74.0027],
  "10039":[40.8286,-73.9366],"10040":[40.8582,-73.9294],"10044":[40.7620,-73.9502],"10065":[40.7648,-73.9629],
  "10069":[40.7754,-73.9885],"10075":[40.7736,-73.9566],"10128":[40.7815,-73.9502],"10280":[40.7096,-74.0167],
  // Bronx
  "10451":[40.8215,-73.9200],"10452":[40.8378,-73.9219],"10453":[40.8532,-73.9124],"10454":[40.8054,-73.9163],
  "10455":[40.8155,-73.9070],"10456":[40.8300,-73.9089],"10457":[40.8467,-73.8988],"10458":[40.8629,-73.8886],
  "10459":[40.8259,-73.8926],"10460":[40.8407,-73.8788],"10461":[40.8471,-73.8410],"10462":[40.8433,-73.8600],
  "10463":[40.8817,-73.9059],"10465":[40.8262,-73.8199],"10466":[40.8908,-73.8467],"10467":[40.8737,-73.8687],
  "10468":[40.8686,-73.9007],"10469":[40.8703,-73.8480],"10470":[40.8975,-73.8688],"10471":[40.8985,-73.8991],
  "10472":[40.8305,-73.8697],"10473":[40.8188,-73.8546],"10474":[40.8121,-73.8863],"10475":[40.8683,-73.8265],
  // Brooklyn
  "11201":[40.6959,-73.9926],"11203":[40.6499,-73.9346],"11204":[40.6197,-73.9856],"11205":[40.6941,-73.9668],
  "11206":[40.7015,-73.9430],"11207":[40.6693,-73.8945],"11208":[40.6716,-73.8724],"11209":[40.6218,-74.0303],
  "11210":[40.6293,-73.9469],"11211":[40.7106,-73.9536],"11212":[40.6626,-73.9142],"11213":[40.6698,-73.9367],
  "11214":[40.5993,-73.9974],"11215":[40.6673,-73.9852],"11216":[40.6811,-73.9497],"11217":[40.6822,-73.9797],
  "11218":[40.6432,-73.9768],"11219":[40.6329,-73.9987],"11220":[40.6414,-74.0142],"11221":[40.6910,-73.9284],
  "11222":[40.7273,-73.9483],"11223":[40.5977,-73.9738],"11224":[40.5772,-73.9906],"11225":[40.6631,-73.9536],
  "11226":[40.6459,-73.9564],"11228":[40.6183,-74.0132],"11229":[40.5989,-73.9450],"11230":[40.6209,-73.9628],
  "11231":[40.6797,-74.0000],"11232":[40.6584,-74.0038],"11233":[40.6790,-73.9207],"11234":[40.6120,-73.9310],
  "11235":[40.5822,-73.9498],"11236":[40.6408,-73.9020],"11237":[40.7020,-73.9204],"11238":[40.6801,-73.9648],
  "11239":[40.6491,-73.8794],"11249":[40.7189,-73.9591],
  // Queens
  "11101":[40.7451,-73.9427],"11102":[40.7710,-73.9264],"11103":[40.7626,-73.9127],"11104":[40.7442,-73.9203],
  "11105":[40.7803,-73.9066],"11106":[40.7629,-73.9315],"11109":[40.7451,-73.9558],
  "11354":[40.7695,-73.8299],"11355":[40.7538,-73.8204],"11356":[40.7854,-73.8451],"11357":[40.7860,-73.8148],
  "11358":[40.7622,-73.7952],"11359":[40.7891,-73.7749],"11360":[40.7783,-73.7844],"11361":[40.7621,-73.7742],
  "11362":[40.7593,-73.7365],"11363":[40.7715,-73.7455],"11364":[40.7418,-73.7622],"11365":[40.7361,-73.7947],
  "11366":[40.7278,-73.7975],"11367":[40.7291,-73.8226],"11368":[40.7502,-73.8556],"11369":[40.7614,-73.8688],
  "11370":[40.7627,-73.8907],"11372":[40.7513,-73.8827],"11373":[40.7365,-73.8788],"11374":[40.7266,-73.8624],
  "11375":[40.7207,-73.8479],"11377":[40.7444,-73.9038],"11378":[40.7250,-73.9092],"11379":[40.7132,-73.8785],
  "11385":[40.7000,-73.8925],
  "11411":[40.6947,-73.7364],"11412":[40.6981,-73.7620],"11413":[40.6749,-73.7562],"11414":[40.6614,-73.8446],
  "11415":[40.7069,-73.8281],"11416":[40.6839,-73.8493],"11417":[40.6797,-73.8449],"11418":[40.6994,-73.8347],
  "11419":[40.6857,-73.8378],"11420":[40.6738,-73.8225],"11421":[40.6923,-73.8578],"11422":[40.6620,-73.7346],
  "11423":[40.7150,-73.7695],"11426":[40.7382,-73.7204],"11427":[40.7302,-73.7477],"11428":[40.7248,-73.7492],
  "11429":[40.7099,-73.7395],"11432":[40.7134,-73.7907],"11433":[40.6980,-73.7899],"11434":[40.6754,-73.7772],
  "11435":[40.6996,-73.8098],"11436":[40.6743,-73.7972],"11691":[40.6013,-73.7563],"11692":[40.5942,-73.7929],
  "11693":[40.5990,-73.8207],"11694":[40.5810,-73.8460],"11697":[40.5555,-73.8918],
  // Staten Island
  "10301":[40.6316,-74.0864],"10302":[40.6323,-74.1370],"10303":[40.6299,-74.1620],"10304":[40.6099,-74.0894],
  "10305":[40.5975,-74.0761],"10306":[40.5713,-74.1198],"10307":[40.5099,-74.2419],"10308":[40.5528,-74.1543],
  "10309":[40.5290,-74.2085],"10310":[40.6337,-74.1163],"10311":[40.6068,-74.1758],"10312":[40.5445,-74.1786],
  "10314":[40.6033,-74.1493],
  // Nassau County (Long Island - key Chinese/Korean areas)
  "11001":[40.7237,-73.7059],"11020":[40.7808,-73.7241],"11021":[40.7846,-73.7359],"11023":[40.7899,-73.7245],
  "11024":[40.8033,-73.7315],"11030":[40.8020,-73.6867],"11040":[40.7431,-73.6890],"11050":[40.8378,-73.6821],
  "11501":[40.7492,-73.6408],"11507":[40.7891,-73.6438],"11514":[40.7647,-73.6320],"11516":[40.6260,-73.7273],
  "11530":[40.7245,-73.6337],"11542":[40.8656,-73.6349],"11552":[40.6946,-73.6598],"11553":[40.7043,-73.6288],
  "11554":[40.7248,-73.5895],"11556":[40.7237,-73.6376],"11558":[40.6209,-73.6668],"11559":[40.6248,-73.7159],
  "11561":[40.5893,-73.6549],"11563":[40.6570,-73.6716],"11565":[40.6588,-73.6404],"11566":[40.6592,-73.5551],
  "11570":[40.6636,-73.6431],"11572":[40.6363,-73.6417],"11575":[40.6796,-73.6079],"11576":[40.7929,-73.6482],
  "11577":[40.7940,-73.6216],"11579":[40.8613,-73.5977],"11580":[40.6740,-73.7115],"11581":[40.6472,-73.7207],
  "11590":[40.7462,-73.5726],"11596":[40.7397,-73.6448],"11598":[40.6360,-73.7085],
  // Northern NJ - Chinese/Korean corridor
  "07020":[40.8210,-73.9782],"07022":[40.8081,-74.0018],"07024":[40.8506,-73.9700],"07026":[40.8657,-74.1213],
  "07030":[40.7434,-74.0324],"07031":[40.8320,-74.1281],"07032":[40.7788,-74.1120],"07047":[40.7856,-74.0246],
  "07050":[40.7723,-74.2325],"07052":[40.7803,-74.2645],"07055":[40.8563,-74.1552],"07057":[40.8590,-74.1130],
  "07070":[40.8320,-74.1153],"07072":[40.8465,-74.0800],"07073":[40.8259,-74.0797],"07074":[40.8394,-74.0430],
  "07075":[40.8536,-74.0839],"07076":[40.6435,-74.3696],"07087":[40.7648,-74.0294],"07093":[40.7891,-74.0129],
  "07094":[40.7867,-74.0459],"07302":[40.7178,-74.0433],"07304":[40.7150,-74.0781],"07305":[40.6935,-74.0824],
  "07306":[40.7350,-74.0655],"07307":[40.7490,-74.0530],"07310":[40.7278,-74.0334],
};

// Haversine distance in miles
function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // earth radius, miles
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Is aide's ZIP within `miles` of search ZIP? Both ZIPs must be in ZIP_COORDS.
function isZipWithinRadius(aideZip, searchZip, miles) {
  const a = ZIP_COORDS[aideZip];
  const s = ZIP_COORDS[searchZip];
  if (!a || !s) return false;
  return haversineMiles(a[0], a[1], s[0], s[1]) <= miles;
}

// ---------- Translations (EN / 中文 / Español) ----------
const STRINGS = {
  en: {
    tagline: "家政通 · Trusted home care for every need, near you",
    heroTitle: "Caring hands for daily life",
    heroText: "From senior companionship, meals, and mobility support to child care and after-school help — find a trusted caregiver for your loved ones, whatever their daily needs.",
    join: "+ Join as an aide",
    tabAides: "🔍 Find an aide", tabJobs: "📋 Care requests",
    browseFree: "Browsing is free.", membersContact: "Members can contact any aide directly.",
    seePlans: "See membership plans", memberActive: "Member — expires",
    findTitle: "Find the right caregiver for your loved one",
    findSub: "Search by ZIP code, then narrow by services, rate, and age.",
    searchPh: "Enter ZIP code where care is needed (e.g. 11354)",
    radiusLbl: "Within:", radiusExact: "Exact ZIP",
    maxRate: "Max $/hr", ageFrom: "Age from", ageTo: "Age to",
    clearFilters: "Clear all filters", allServices: "All services",
    availableSuffix: "aides available", loadingAides: "Loading aides…",
    noAidesTitle: "No aides have joined yet",
    noAidesSub: "Be the first — tap “Join as an aide” to create a profile.",
    noMatchTitle: "No matches for that search",
    noMatchSub: "Try a different city, service, or spelling.",
    viewProfile: "View profile & contact", showLess: "Show less", editBtn: "✎ Edit",
    ageLbl: "Age", yrsExp: "yrs exp", speaks: "Speaks:", certified: "Certified:",
    contactLbl: "Contact:", contactPerson: "Contact",
    lockedLine: "Contact: (•••) •••-•••• — members can call or email any aide directly.",
    viewContact: "Show contact info", contactHidden: "Contact details are hidden — tap to reveal",
    unlock: "Unlock contact info",
    pinPrompt: "Enter the 4-digit PIN to continue",
    confirm: "Confirm", cancel: "Cancel", pinBad: "That PIN doesn't match.",
    regTitle: "Create your aide profile",
    regSub: "Fill this out once — families in your area will be able to find you.",
    updTitle: "Update your profile",
    updSub: "Change anything below — your updates go live as soon as you save.",
    selfie: "Take a selfie", retake: "Retake photo", processing: "Processing…",
    cameraNote: "On a phone, this opens your front camera.",
    lName: "Full name", lPhone: "Phone", lEmail: "Email", lCity: "City", lZip: "ZIP",
    lAge: "Age", lYrs: "Yrs experience", lRate: "Rate ($/hr)", lLang: "Languages spoken",
    lServices: "Services you offer", lCerts: "Certifications", lAbout: "About you",
    manageProfile: "Caregiver? Manage my profile ✎",
    aideLoginTitle: "Manage my profile",
    aideLoginSub: "Enter the phone number and 4-digit PIN you used when you registered.",
    aideLoginBtn: "Open my profile",
    aideLoginErr: "No profile found matching that phone number and PIN.",
    pendingEdit: "⏳ Your profile is pending verification — families can't see it yet, but you can update it and it will be reviewed.",
    lCertPhoto: "License / certification photo (optional)",
    certPhotoNote: "Used by Kajing Care for verification only — never shown publicly.",
    certUpload: "Add license photo",
    certRetake: "Replace photo",
    lPin: "4-digit PIN (needed to edit or remove your profile later)",
    lPinJob: "4-digit PIN (needed to edit or remove your post later)",
    publish: "Publish my profile", save: "Save changes", saving: "Saving…",
    noteShared: "Note: profiles in this demo are visible to everyone using this app.",
    errReq: "Name, phone, and city are required.",
    errPhoto: "Please add a profile photo — families want to see who they're hiring.",
    errZip: "Please enter your 5-digit ZIP code — families search by ZIP to find aides nearby.",
    errPin: "Please set a 4-digit PIN so you can edit later.",
    errSave: "Could not save. Please try again.",
    errJobReq: "Title, your name, phone, and city are required.",
    jobsIntro: "Families post their needs here — aides reach out directly.",
    postBtn: "+ Post a care request", loadingJobs: "Loading care requests…",
    noJobsTitle: "No care requests yet",
    noJobsSub: "Need care? Post a care request and let aides come to you.",
    openSuffix: "open requests", viewDetails: "View details & contact", postedOn: "posted",
    jfTitle: "Post a care request", jfUpd: "Update your care request",
    jfSub: "Describe what you need — interested aides will contact you directly.",
    lTitle: "Title", lYourName: "Your name", lSchedule: "Schedule needed",
    lOffered: "Offered $/hr", lDetails: "Details",
    detailsPh: "Tell aides about your loved one's needs, language preferences, home environment, etc. Please don't include your street address.",
    publishJob: "Publish care request",
    jobShared: "Your post — including your name and phone — will be visible to everyone using this platform, so aides can reach you. Don't include your street address.",
    plTitle: "Become a member",
    plSub: "Browsing is always free. A membership unlocks every aide's phone number and email, so you can contact as many aides as you need — whether you're nearby or arranging care for a loved one from another state or country.",
    demoText: "Demo checkout: no real payment is collected in this prototype. In the live version, this button opens Stripe's secure payment page — accepting cards from any country, Apple Pay, Google Pay, Alipay (支付宝), and WeChat Pay (微信支付).",
    activate: "Activate demo membership", popular: "MOST POPULAR", back: "← Back",
    benefitsTitle: "Every membership includes:",
    benefit1: "Unlimited caregiver contacts",
    benefit2: "Free replacement matching if your caregiver becomes unavailable",
    benefit3: "Post care requests — let caregivers come to you",
    benefit4: "Write and read verified reviews",
    suName: "Single Unlock", suPrice: "$12.99", suPer: " one-time",
    suBlurb: "Not ready for a membership? Unlock this one caregiver's full profile and contact info.",
    featuredBadge: "★ Featured",
    teaserName: "Verified Caregiver",
    tabAgencies: "🏛️ Agencies",
    noAgencies: "No agency partners are listed yet.",
    advertiseLine: "Licensed home care agency? Advertise on Kajing Care — contact support@kajingcare.com.",
    medicaidTeaser: "Think you may qualify for Medicaid home care? See licensed agencies",
    partnersTitle: "Medicaid & Licensed Agency Partners",
    partnersSub: "Think your loved one may qualify for Medicaid home care? These licensed agencies can help you check eligibility, apply, and receive covered care.",
    sponsoredTag: "Sponsored", partnerCall: "Call", partnerSite: "Website",
    postFeeTitle: "Care request posting fee",
    postFeeNote: "One-time $9.99 fee per posting. Demo checkout — no real payment is collected in this prototype; the live version uses Stripe's secure payment page.",
    payPublish: "Pay $9.99 & publish",
    aideProLocked: "Client contact info is available to Aide Pro members.",
    aideProBtn: "Become Aide Pro — $14.99/month (demo)",
    tAidePro: "Aide Pro active — client contacts unlocked ✓",
    tUnlocked: "Caregiver unlocked ✓",
    plan_monthly: "Monthly", plan_quarterly: "3 Months", plan_annual: "Annual",
    blurb_monthly: "Full access, cancel anytime.",
    blurb_quarterly: "Save 17% — most popular.",
    blurb_annual: "Best value — save 37%.",
    lServicesNeeded: "Services needed",
    grpSenior: "Senior care", grpChild: "Child & family", grpHome: "Household help", grpExtended: "Extended care",
    authTitle: "Member account",
    authSub: "Create a free account so your membership follows you on any device.",
    signUp: "Create account", signIn: "Sign in",
    lEmailAddr: "Email", lPassword: "Password (6+ characters)",
    authToLogin: "Already have an account? Sign in",
    authToSignup: "New here? Create account",
    authErr: "Sign-in failed — check your email and password.",
    authConfirm: "Account created — confirm via the email we sent, then sign in.",
    signOut: "Sign out", tSignedIn: "Welcome ✓",
    // Phone auth (v3.3)
    phoneAuthTitle: "Sign in with your phone",
    phoneAuthSub: "We'll text you a 6-digit code. Your account works on any device.",
    lPhoneNumber: "Phone number",
    lVerifyCode: "6-digit code",
    lSetPin: "Set a 6-digit PIN",
    lConfirmPin: "Confirm PIN",
    lEnterPin: "Enter your PIN",
    phoneAuthSend: "Send code",
    phoneAuthContinue: "Continue",
    phoneAuthVerify: "Verify",
    phoneAuthResend: "Didn't get it? Send again",
    phoneAuthBad: "Wrong or expired code. Try again.",
    phoneAuthWrongPin: "Wrong phone or PIN.",
    phoneAuthPinMismatch: "PINs don't match.",
    phoneAuthPinLen: "PIN must be 6 digits.",
    phoneAuthSendErr: "Could not send code. Check the phone number.",
    phoneAuthPhoneBad: "Please enter a valid phone number.",
    phoneAuthNewUser: "Welcome! Tell us a bit about you.",
    phoneAuthReturning: "Welcome back",
    phoneAuthRolePrompt: "I am a…",
    roleMember: "Family looking for care",
    roleAide: "Caregiver / Home aide",
    roleAgency: "Home-care agency",
    phoneAuthFinish: "Finish",
    signInBtn: "Sign in",
    // Home landing (v3.10)
    landingHeroTitle: "One trusted platform for every family need",
    landingHeroSub: "Kakatong 家家通 connects families with verified caregivers, tutors, and coaches — from the same community you know and trust.",
    landingHeroCta: "Sign in or create account",
    pickCategoryTitle: "What are you looking for today?",
    pickCategorySub: "Pick a category to browse verified providers near you.",
    landingCareTag: "Trusted caregivers for the moments that matter most.",
    landingCareItems: ["Home aides & elder care", "Child care & babysitters", "Companionship & respite"],
    landingLearnTag: "Tutors and teachers who meet your child where they are.",
    landingLearnItems: ["Academic tutoring & test prep", "Music theory & language", "College application coaching"],
    landingKidsTag: "Fun, growth, and confidence — after school and weekends.",
    landingKidsItems: ["Piano, violin & dance", "Swim & sports coaching", "Art, drawing & martial arts"],
    landingBrowse: "Browse",
    howItWorksTitle: "How Kakatong works",
    step1Title: "Browse verified providers",
    step1Sub: "Search by ZIP, language, and rate. Every provider is ID-checked and license-verified.",
    step2Title: "Contact directly",
    step2Sub: "Reach out by phone or message. No agency middleman.",
    step3Title: "Hire on your terms",
    step3Sub: "You decide what to pay, when to start, and how long to work together.",
    agencyReports: "Agency reports",
    agencyLocked: "Verified home-care agency",
    agencyLockedSub: "Contact info visible to members and Aide Pro users.",
    agencyUnlockBtn: "🔒 Unlock agency contact",
    agencyDashTitle: "Agency Reports",
    agencyDashSub: "Real activity from families looking for care — the last 30 days.",
    hotAides: "Hot aides — last 30 days",
    hotAidesSub: "Which caregivers families are viewing and contacting most.",
    marketDemand: "Where care is being searched",
    marketDemandSub: "Top ZIP codes families are searching from.",
    tblRank: "#", tblAide: "Aide", tblLocation: "Location",
    tblViews: "Views", tblContacts: "Contacts", tblRate: "Contact rate",
    tblZip: "ZIP", tblSearches: "Searches", tblResults: "Avg results",
    reportEmpty: "No activity in the last 30 days yet.",
    upgradeCta: "🔒 Unlock the full report — see all top aides and every search",
    upgradeBtn: "Upgrade to full report",
    demoSeedBtn: "Seed demo events",
    demoSeedDone: "Demo events created:",
    demoSeedFail: "Seeding failed — check console.",
    hiredBtn: "✓ I hired this caregiver",
    hireFormLabel: "Your name (shown with your future review)",
    hireConfirm: "Confirm hire",
    tHired: "🎉 Congratulations on your match! You can leave a review anytime.",
    hiredBadge: "✓ Hired via Kajing Care",
    reviews: "Reviews", writeReview: "Write a review",
    commentPh: "How was the service? Punctuality, care quality, communication…",
    submitReview: "Submit review", noReviews: "No reviews yet.",
    errReview: "Please select a star rating and enter your name.",
    tReview: "Thank you — your review is posted ✓",
    faqTitle: "Frequently Asked Questions", faqClientTitle: "For Families", faqAideTitle: "For Caregivers", faqLink: "FAQ", whyMembership: "Why membership?",
    fPrivacy: "Privacy Policy", fTerms: "Terms of Service", fBackup: "Backup (testing)",
    fCopy: "© 2026 Kajing Care 家政通. Families are responsible for screening and hiring decisions.",
    tProfileLive: "Your profile has been submitted for review — it will appear in the directory once Kajing Care verifies it ✓",
    verifiedBadge: "✓ Verified", tProfileUpd: "Profile updated ✓", tProfileRem: "Profile removed.",
    tJobLive: "Your care request is live! 🎉", tJobUpd: "Care request updated ✓", tJobRem: "Care request removed.",
    tMember: "Membership active — contact info unlocked ✓",
  },
  zh: {
    tagline: "家政通 · 全方位可信賴的居家照護",
    heroTitle: "用心照護，安享日常",
    heroText: "從長者陪伴、備餐、行動輔助，到兒童照護與課後看顧 — 為您的家人找到值得信賴的照護者。",
    join: "+ 看護註冊",
    tabAides: "🔍 尋找看護", tabJobs: "📋 徵求看護",
    browseFree: "瀏覽完全免費。", membersContact: "會員可直接聯繫任何看護。",
    seePlans: "查看會員方案", memberActive: "會員 — 到期日",
    findTitle: "為您的家人找到合適的看護",
    findSub: "先輸入郵遞區號，再依服務、時薪與年齡篩選。",
    searchPh: "輸入需要照護地區的郵遞區號（例：11354）",
    radiusLbl: "範圍：", radiusExact: "同郵區",
    maxRate: "時薪上限", ageFrom: "年齡從", ageTo: "至",
    clearFilters: "清除所有篩選", allServices: "全部服務",
    availableSuffix: "位看護", loadingAides: "載入中…",
    noAidesTitle: "目前還沒有看護加入",
    noAidesSub: "成為第一位 — 點選「看護註冊」建立檔案。",
    noMatchTitle: "沒有符合的結果",
    noMatchSub: "請嘗試其他城市、服務或關鍵字。",
    viewProfile: "查看檔案與聯絡方式", showLess: "收起", editBtn: "✎ 編輯",
    ageLbl: "年齡", yrsExp: "年經驗", speaks: "語言：", certified: "證照：",
    contactLbl: "聯絡方式：", contactPerson: "聯絡",
    lockedLine: "聯絡方式：(•••) •••-•••• — 會員可直接致電或發郵件給任何看護。",
    viewContact: "顯示聯絡資訊", contactHidden: "聯絡資訊已隱藏 — 點擊顯示",
    unlock: "解鎖聯絡方式",
    pinPrompt: "請輸入 4 位數 PIN 碼以繼續",
    confirm: "確認", cancel: "取消", pinBad: "PIN 碼不正確。",
    regTitle: "建立看護檔案",
    regSub: "只需填寫一次 — 您附近的家庭就能找到您。",
    updTitle: "更新您的檔案",
    updSub: "修改以下內容 — 儲存後立即生效。",
    selfie: "自拍照片", retake: "重拍", processing: "處理中…",
    cameraNote: "手機上會開啟前置鏡頭。",
    lName: "姓名", lPhone: "電話", lEmail: "電子郵件", lCity: "城市", lZip: "郵遞區號",
    lAge: "年齡", lYrs: "經驗年數", lRate: "時薪（美元）", lLang: "會說的語言",
    lServices: "提供的服務", lCerts: "證照", lAbout: "自我介紹",
    manageProfile: "我是照護者？管理我的檔案 ✎",
    aideLoginTitle: "管理我的檔案",
    aideLoginSub: "請輸入註冊時使用的電話號碼與 4 位數 PIN 碼。",
    aideLoginBtn: "開啟我的檔案",
    aideLoginErr: "找不到符合該電話與 PIN 碼的檔案。",
    pendingEdit: "⏳ 您的檔案正在審核中 — 家庭目前看不到，但您可以更新內容，我們將一併審核。",
    lCertPhoto: "證照照片（選填）",
    certPhotoNote: "僅供家政通驗證使用 — 不會公開顯示。",
    certUpload: "上傳證照照片",
    certRetake: "重新上傳",
    lPin: "4 位數 PIN 碼（日後編輯或刪除檔案時需要）",
    lPinJob: "4 位數 PIN 碼（日後編輯或刪除貼文時需要）",
    publish: "發布我的檔案", save: "儲存變更", saving: "儲存中…",
    noteShared: "注意：此示範版的檔案對所有使用者可見。",
    errReq: "姓名、電話與城市為必填。",
    errPhoto: "請上傳照片 — 家庭希望看到看護的樣子。",
    errZip: "請輸入 5 位數郵遞區號 — 家庭以郵遞區號搜尋附近的看護。",
    errPin: "請設定 4 位數 PIN 碼，以便日後編輯。",
    errSave: "儲存失敗，請再試一次。",
    errJobReq: "標題、稱呼、電話與城市為必填。",
    jobsIntro: "家庭在此發布需求 — 看護會直接與您聯繫。",
    postBtn: "+ 發布徵求", loadingJobs: "載入中…",
    noJobsTitle: "目前沒有徵求資訊",
    noJobsSub: "需要照護？發布徵求，讓看護主動聯繫您。",
    openSuffix: "則徵求", viewDetails: "查看詳情與聯絡方式", postedOn: "發布於",
    jfTitle: "發布照護徵求", jfUpd: "更新徵求內容",
    jfSub: "描述您的需求 — 有興趣的看護會直接聯繫您。",
    lTitle: "標題", lYourName: "您的稱呼", lSchedule: "需要的時段",
    lOffered: "提供時薪", lDetails: "詳細說明",
    detailsPh: "說明家人的照護需求、語言偏好、居家環境等。請勿填寫詳細住址。",
    publishJob: "發布徵求",
    jobShared: "您的貼文（含姓名與電話）將對所有使用者公開，方便看護與您聯繫。請勿填寫詳細住址。",
    plTitle: "成為會員",
    plSub: "瀏覽永遠免費。成為會員即可解鎖所有看護的電話與郵件 — 無論您在本地，或在外州、海外為家人安排照護。",
    demoText: "示範結帳：本原型不會收取任何費用。正式版將開啟 Stripe 安全付款頁面 — 支援各國信用卡、Apple Pay、Google Pay、支付寶與微信支付。",
    activate: "啟用示範會員", popular: "最受歡迎", back: "← 返回",
    benefitsTitle: "所有會員方案皆包含：",
    benefit1: "無限次聯繫照護者",
    benefit2: "照護者無法繼續時，免費重新配對",
    benefit3: "發布照護徵求 — 讓照護者主動聯繫您",
    benefit4: "撰寫並查看真實評價",
    suName: "單次解鎖", suPrice: "$12.99", suPer: " 一次性",
    suBlurb: "還不想加入會員？單次解鎖這位照護者的完整檔案與聯絡方式。",
    featuredBadge: "★ 精選",
    teaserName: "已驗證照護者",
    tabAgencies: "🏛️ 照護機構",
    noAgencies: "目前尚無機構夥伴。",
    advertiseLine: "您是持牌居家照護機構？歡迎在家政通刊登廣告 — 請聯繫 support@kajingcare.com。",
    medicaidTeaser: "家人可能符合 Medicaid 資格？查看持牌機構",
    partnersTitle: "Medicaid 與持牌機構夥伴",
    partnersSub: "您的家人可能符合 Medicaid 居家照護資格？這些持牌機構可協助您確認資格、提出申請並獲得保險給付的照護。",
    sponsoredTag: "贊助", partnerCall: "致電", partnerSite: "網站",
    postFeeTitle: "徵求發布費",
    postFeeNote: "每則徵求一次性收費 $9.99。示範結帳 — 原型不會實際收費；正式版將使用 Stripe 安全付款頁面。",
    payPublish: "支付 $9.99 並發布",
    aideProLocked: "客戶聯絡方式僅限 Aide Pro 會員查看。",
    aideProBtn: "成為 Aide Pro — 每月 $14.99（示範）",
    tAidePro: "Aide Pro 已啟用 — 客戶聯絡方式已解鎖 ✓",
    tUnlocked: "已解鎖照護者 ✓",
    plan_monthly: "月繳", plan_quarterly: "季繳（3 個月）", plan_annual: "年繳",
    blurb_monthly: "完整功能，隨時取消。",
    blurb_quarterly: "省 17% — 最受歡迎。",
    blurb_annual: "最划算 — 省 37%。",
    lServicesNeeded: "需要的服務",
    grpSenior: "長者照護", grpChild: "兒童與家庭", grpHome: "家務協助", grpExtended: "進階照護",
    authTitle: "會員帳號",
    authSub: "建立免費帳號，您的會員資格即可在任何裝置上使用。",
    signUp: "建立帳號", signIn: "登入",
    lEmailAddr: "電子郵件", lPassword: "密碼（6 位以上）",
    authToLogin: "已有帳號？登入",
    authToSignup: "新用戶？建立帳號",
    authErr: "登入失敗 — 請檢查電子郵件與密碼。",
    authConfirm: "帳號已建立 — 請點擊確認郵件後再登入。",
    signOut: "登出", tSignedIn: "歡迎 ✓",
    phoneAuthTitle: "以手機號碼登入",
    phoneAuthSub: "我們會發送 6 位數驗證碼。您的帳號可在任何裝置使用。",
    lPhoneNumber: "手機號碼",
    lVerifyCode: "6 位數驗證碼",
    lSetPin: "設定 6 位數 PIN 碼",
    lConfirmPin: "確認 PIN 碼",
    lEnterPin: "輸入您的 PIN 碼",
    phoneAuthSend: "發送驗證碼",
    phoneAuthContinue: "繼續",
    phoneAuthVerify: "驗證",
    phoneAuthResend: "沒收到？重新發送",
    phoneAuthBad: "驗證碼錯誤或已過期，請再試一次。",
    phoneAuthWrongPin: "手機或 PIN 碼錯誤。",
    phoneAuthPinMismatch: "兩次輸入的 PIN 碼不同。",
    phoneAuthPinLen: "PIN 碼必須為 6 位數。",
    phoneAuthSendErr: "無法發送驗證碼，請檢查手機號碼。",
    phoneAuthPhoneBad: "請輸入有效的手機號碼。",
    phoneAuthNewUser: "歡迎！請簡單介紹一下您。",
    phoneAuthReturning: "歡迎回來",
    phoneAuthRolePrompt: "我是…",
    roleMember: "尋找照護的家庭",
    roleAide: "照護者 / 家政員",
    roleAgency: "居家照護機構",
    phoneAuthFinish: "完成",
    signInBtn: "登入",
    // Home landing (v3.10)
    landingHeroTitle: "一個平台，滿足每個家庭的需求",
    landingHeroSub: "家家通 Kakatong 連結家庭與經過驗證的照護員、家教與教練 — 都來自您熟悉信賴的社區。",
    landingHeroCta: "登入或建立帳號",
    pickCategoryTitle: "您今天想找什麼？",
    pickCategorySub: "選擇類別，瀏覽附近經過驗證的服務提供者。",
    landingCareTag: "值得信賴的照護 — 陪伴每一個重要時刻。",
    landingCareItems: ["家政、長者照護", "育兒、褓姆", "陪伴、短期照護"],
    landingLearnTag: "因材施教的家教與老師。",
    landingLearnItems: ["學科補習、升學考試準備", "音樂理論、語言學習", "大學申請輔導"],
    landingKidsTag: "課後、週末 — 快樂學習，健康成長。",
    landingKidsItems: ["鋼琴、小提琴、舞蹈", "游泳、運動教練", "美術、繪畫、武術"],
    landingBrowse: "瀏覽",
    howItWorksTitle: "家家通如何運作",
    step1Title: "瀏覽經過驗證的服務者",
    step1Sub: "以郵遞區號、語言和時薪搜尋。每位服務者皆經身份與證照查核。",
    step2Title: "直接聯繫",
    step2Sub: "以電話或訊息直接聯繫，無中介抽成。",
    step3Title: "以您的條件雇用",
    step3Sub: "由您決定薪資、起始時間，以及合作長度。",
    agencyReports: "機構報告",
    agencyLocked: "已認證居家照護機構",
    agencyLockedSub: "會員與家政員 Pro 可查看聯絡方式。",
    agencyUnlockBtn: "🔒 解鎖機構聯絡資訊",
    agencyDashTitle: "機構報告",
    agencyDashSub: "尋找照護的家庭 — 過去 30 天的真實活動數據。",
    hotAides: "熱門家政員 — 過去 30 天",
    hotAidesSub: "家庭最常瀏覽和聯繫的照護者。",
    marketDemand: "尋找照護的區域",
    marketDemandSub: "家庭搜尋最多的 ZIP 郵區。",
    tblRank: "排名", tblAide: "家政員", tblLocation: "地區",
    tblViews: "瀏覽", tblContacts: "聯繫", tblRate: "聯繫率",
    tblZip: "郵區", tblSearches: "搜尋次數", tblResults: "平均結果",
    reportEmpty: "過去 30 天暫無活動數據。",
    upgradeCta: "🔒 解鎖完整報告 — 查看所有熱門家政員與搜尋數據",
    upgradeBtn: "升級查看完整報告",
    demoSeedBtn: "產生示範資料",
    demoSeedDone: "已新增示範事件數：",
    demoSeedFail: "產生失敗 — 請查看主控台。",
    hiredBtn: "✓ 我已聘用這位照護者",
    hireFormLabel: "您的稱呼（將與您日後的評價一同顯示）",
    hireConfirm: "確認聘用",
    tHired: "🎉 恭喜配對成功！歡迎隨時留下評價。",
    hiredBadge: "✓ 透過家政通聘用",
    reviews: "評價", writeReview: "撰寫評價",
    commentPh: "服務如何？守時、照護品質、溝通…",
    submitReview: "送出評價", noReviews: "目前還沒有評價。",
    errReview: "請選擇星等並填寫稱呼。",
    tReview: "感謝您 — 評價已發布 ✓",
    faqTitle: "常見問題", faqClientTitle: "給家庭（客戶）", faqAideTitle: "給照護者", faqLink: "常見問題", whyMembership: "為何要加入會員？",
    fPrivacy: "隱私政策", fTerms: "服務條款", fBackup: "備份（測試用）",
    fCopy: "© 2026 Kajing Care 家政通。家庭須自行負責審核與聘用決定。",
    tProfileLive: "您的檔案已送出審核 — 通過驗證後將顯示於名錄中 ✓",
    verifiedBadge: "✓ 已驗證", tProfileUpd: "檔案已更新 ✓", tProfileRem: "檔案已刪除。",
    tJobLive: "您的徵求已發布！🎉", tJobUpd: "徵求已更新 ✓", tJobRem: "徵求已刪除。",
    tMember: "會員已啟用 — 聯絡方式已解鎖 ✓",
  },
  es: {
    tagline: "家政通 · Cuidado a domicilio de confianza para toda necesidad",
    heroTitle: "Manos que cuidan la vida diaria",
    heroText: "Desde compañía para mayores y apoyo de movilidad hasta cuidado infantil y ayuda después de clases — encuentre un cuidador de confianza para su familia.",
    join: "+ Soy cuidador/a",
    tabAides: "🔍 Buscar cuidador", tabJobs: "📋 Solicitudes",
    browseFree: "Navegar es gratis.", membersContact: "Los miembros pueden contactar a cualquier cuidador.",
    seePlans: "Ver planes de membresía", memberActive: "Miembro — vence",
    findTitle: "Encuentre el cuidador ideal para su ser querido",
    findSub: "Busque por código postal y filtre por servicios, tarifa y edad.",
    searchPh: "Ingrese el código postal donde se necesita cuidado (ej. 11354)",
    radiusLbl: "Dentro de:", radiusExact: "CP exacto",
    maxRate: "Máx $/hora", ageFrom: "Edad desde", ageTo: "hasta",
    clearFilters: "Borrar filtros", allServices: "Todos los servicios",
    availableSuffix: "cuidadores disponibles", loadingAides: "Cargando…",
    noAidesTitle: "Aún no hay cuidadores",
    noAidesSub: "Sea el primero — toque «Soy cuidador/a» para crear su perfil.",
    noMatchTitle: "Sin resultados",
    noMatchSub: "Pruebe otra ciudad, servicio u ortografía.",
    viewProfile: "Ver perfil y contacto", showLess: "Ver menos", editBtn: "✎ Editar",
    ageLbl: "Edad", yrsExp: "años exp.", speaks: "Habla:", certified: "Certificado:",
    contactLbl: "Contacto:", contactPerson: "Contactar a",
    lockedLine: "Contacto: (•••) •••-•••• — los miembros pueden llamar o escribir a cualquier cuidador.",
    viewContact: "Mostrar contacto", contactHidden: "Datos de contacto ocultos — toque para revelar",
    unlock: "Desbloquear contacto",
    pinPrompt: "Ingrese el PIN de 4 dígitos para continuar",
    confirm: "Confirmar", cancel: "Cancelar", pinBad: "El PIN no coincide.",
    regTitle: "Cree su perfil de cuidador",
    regSub: "Complételo una vez — las familias de su zona podrán encontrarlo.",
    updTitle: "Actualice su perfil",
    updSub: "Cambie lo que necesite — se publica al guardar.",
    selfie: "Tomar una selfie", retake: "Repetir foto", processing: "Procesando…",
    cameraNote: "En el teléfono, abre la cámara frontal.",
    lName: "Nombre completo", lPhone: "Teléfono", lEmail: "Correo", lCity: "Ciudad", lZip: "Código postal",
    lAge: "Edad", lYrs: "Años de experiencia", lRate: "Tarifa ($/h)", lLang: "Idiomas",
    lServices: "Servicios que ofrece", lCerts: "Certificaciones", lAbout: "Sobre usted",
    manageProfile: "¿Cuidador/a? Administrar mi perfil ✎",
    aideLoginTitle: "Administrar mi perfil",
    aideLoginSub: "Ingrese el número de teléfono y el PIN de 4 dígitos que usó al registrarse.",
    aideLoginBtn: "Abrir mi perfil",
    aideLoginErr: "No se encontró un perfil con ese teléfono y PIN.",
    pendingEdit: "⏳ Su perfil está pendiente de verificación — las familias aún no lo ven, pero puede actualizarlo.",
    lCertPhoto: "Foto de licencia / certificación (opcional)",
    certPhotoNote: "Solo para verificación de Kajing Care — nunca se muestra públicamente.",
    certUpload: "Agregar foto de licencia",
    certRetake: "Reemplazar foto",
    lPin: "PIN de 4 dígitos (para editar o eliminar su perfil después)",
    lPinJob: "PIN de 4 dígitos (para editar o eliminar su publicación después)",
    publish: "Publicar mi perfil", save: "Guardar cambios", saving: "Guardando…",
    noteShared: "Nota: en esta demo los perfiles son visibles para todos.",
    errReq: "Nombre, teléfono y ciudad son obligatorios.",
    errPhoto: "Agregue una foto — las familias quieren ver a quién contratan.",
    errZip: "Ingrese su código postal de 5 dígitos — las familias buscan por CP para encontrar cuidadores cerca.",
    errPin: "Establezca un PIN de 4 dígitos para poder editar después.",
    errSave: "No se pudo guardar. Intente de nuevo.",
    errJobReq: "Título, nombre, teléfono y ciudad son obligatorios.",
    jobsIntro: "Las familias publican sus necesidades — los cuidadores las contactan directamente.",
    postBtn: "+ Publicar solicitud", loadingJobs: "Cargando…",
    noJobsTitle: "Aún no hay solicitudes",
    noJobsSub: "¿Necesita cuidado? Publique una solicitud y deje que los cuidadores lo contacten.",
    openSuffix: "solicitudes abiertas", viewDetails: "Ver detalles y contacto", postedOn: "publicado",
    jfTitle: "Publicar una solicitud de cuidado", jfUpd: "Actualizar su solicitud",
    jfSub: "Describa lo que necesita — los cuidadores interesados lo contactarán.",
    lTitle: "Título", lYourName: "Su nombre", lSchedule: "Horario necesario",
    lOffered: "Tarifa ofrecida $/h", lDetails: "Detalles",
    detailsPh: "Describa las necesidades de su ser querido, idiomas preferidos, entorno del hogar, etc. No incluya su dirección exacta.",
    publishJob: "Publicar solicitud",
    jobShared: "Su publicación (nombre y teléfono incluidos) será visible para todos, para que los cuidadores puedan contactarlo. No incluya su dirección exacta.",
    plTitle: "Hágase miembro",
    plSub: "Navegar siempre es gratis. La membresía desbloquea el teléfono y correo de todos los cuidadores — esté cerca o coordinando el cuidado desde otro estado o país.",
    demoText: "Pago de demostración: este prototipo no cobra nada. En la versión real se abrirá la página segura de Stripe — tarjetas de cualquier país, Apple Pay, Google Pay, Alipay y WeChat Pay.",
    activate: "Activar membresía demo", popular: "MÁS POPULAR", back: "← Volver",
    benefitsTitle: "Toda membresía incluye:",
    benefit1: "Contactos ilimitados con cuidadores",
    benefit2: "Reemplazo gratuito si su cuidador deja de estar disponible",
    benefit3: "Publique solicitudes — deje que los cuidadores lo contacten",
    benefit4: "Escriba y lea reseñas verificadas",
    suName: "Desbloqueo Único", suPrice: "$12.99", suPer: " pago único",
    suBlurb: "¿No está listo para una membresía? Desbloquee el perfil completo y contacto de este cuidador.",
    featuredBadge: "★ Destacado",
    teaserName: "Cuidador Verificado",
    tabAgencies: "🏛️ Agencias",
    noAgencies: "Aún no hay agencias asociadas.",
    advertiseLine: "¿Agencia licenciada de cuidado en el hogar? Anúnciese en Kajing Care — contacte support@kajingcare.com.",
    medicaidTeaser: "¿Podría calificar para Medicaid? Vea agencias licenciadas",
    partnersTitle: "Agencias Licenciadas y Medicaid",
    partnersSub: "¿Su ser querido podría calificar para cuidado en el hogar por Medicaid? Estas agencias licenciadas pueden ayudarle a verificar la elegibilidad, aplicar y recibir cuidado cubierto.",
    sponsoredTag: "Patrocinado", partnerCall: "Llamar", partnerSite: "Sitio web",
    postFeeTitle: "Tarifa por publicar solicitud",
    postFeeNote: "Pago único de $9.99 por publicación. Pago de demostración — este prototipo no cobra; la versión real usará la página segura de Stripe.",
    payPublish: "Pagar $9.99 y publicar",
    aideProLocked: "El contacto del cliente está disponible para miembros Aide Pro.",
    aideProBtn: "Hazte Aide Pro — $14.99/mes (demo)",
    tAidePro: "Aide Pro activo — contactos de clientes desbloqueados ✓",
    tUnlocked: "Cuidador desbloqueado ✓",
    plan_monthly: "Mensual", plan_quarterly: "3 meses", plan_annual: "Anual",
    blurb_monthly: "Acceso total, cancele cuando quiera.",
    blurb_quarterly: "Ahorre 17% — el más popular.",
    blurb_annual: "Mejor precio — ahorre 37%.",
    lServicesNeeded: "Servicios necesarios",
    grpSenior: "Cuidado de mayores", grpChild: "Niños y familia", grpHome: "Ayuda del hogar", grpExtended: "Cuidado extendido",
    authTitle: "Cuenta de miembro",
    authSub: "Cree una cuenta gratuita para que su membresía funcione en cualquier dispositivo.",
    signUp: "Crear cuenta", signIn: "Iniciar sesión",
    lEmailAddr: "Correo electrónico", lPassword: "Contraseña (6+ caracteres)",
    authToLogin: "¿Ya tiene cuenta? Inicie sesión",
    authToSignup: "¿Nuevo? Cree una cuenta",
    authErr: "Error al iniciar sesión — revise correo y contraseña.",
    authConfirm: "Cuenta creada — confirme con el correo enviado y luego inicie sesión.",
    signOut: "Cerrar sesión", tSignedIn: "Bienvenido ✓",
    phoneAuthTitle: "Iniciar sesión con su teléfono",
    phoneAuthSub: "Le enviaremos un código de 6 dígitos. Su cuenta funciona en cualquier dispositivo.",
    lPhoneNumber: "Número de teléfono",
    lVerifyCode: "Código de 6 dígitos",
    lSetPin: "Elija un PIN de 6 dígitos",
    lConfirmPin: "Confirmar PIN",
    lEnterPin: "Ingrese su PIN",
    phoneAuthSend: "Enviar código",
    phoneAuthContinue: "Continuar",
    phoneAuthVerify: "Verificar",
    phoneAuthResend: "¿No lo recibió? Enviar de nuevo",
    phoneAuthBad: "Código incorrecto o vencido. Intente de nuevo.",
    phoneAuthWrongPin: "Teléfono o PIN incorrecto.",
    phoneAuthPinMismatch: "Los PIN no coinciden.",
    phoneAuthPinLen: "El PIN debe tener 6 dígitos.",
    phoneAuthSendErr: "No se pudo enviar el código. Revise el teléfono.",
    phoneAuthPhoneBad: "Ingrese un número de teléfono válido.",
    phoneAuthNewUser: "¡Bienvenido! Cuéntenos un poco sobre usted.",
    phoneAuthReturning: "Bienvenido de nuevo",
    phoneAuthRolePrompt: "Yo soy…",
    roleMember: "Familia que busca cuidado",
    roleAide: "Cuidador/a / Auxiliar",
    roleAgency: "Agencia de cuidado en el hogar",
    phoneAuthFinish: "Finalizar",
    signInBtn: "Iniciar sesión",
    // Home landing (v3.10)
    landingHeroTitle: "Una plataforma confiable para las necesidades de toda familia",
    landingHeroSub: "Kakatong 家家通 conecta a familias con cuidadores, tutores y entrenadores verificados — de la misma comunidad que usted conoce.",
    landingHeroCta: "Iniciar sesión o crear cuenta",
    pickCategoryTitle: "¿Qué busca hoy?",
    pickCategorySub: "Elija una categoría para ver proveedores verificados cerca de usted.",
    landingCareTag: "Cuidadores de confianza para los momentos importantes.",
    landingCareItems: ["Cuidado en el hogar y de ancianos", "Cuidado infantil y niñeras", "Compañía y respiro"],
    landingLearnTag: "Tutores y maestros que enseñan al ritmo de su hijo.",
    landingLearnItems: ["Tutoría académica y preparación de exámenes", "Teoría musical e idiomas", "Asesoría universitaria"],
    landingKidsTag: "Diversión, crecimiento y confianza — después de clases y fines de semana.",
    landingKidsItems: ["Piano, violín y danza", "Natación y entrenamiento deportivo", "Arte, dibujo y artes marciales"],
    landingBrowse: "Explorar",
    howItWorksTitle: "Cómo funciona Kakatong",
    step1Title: "Explore proveedores verificados",
    step1Sub: "Busque por código postal, idioma y tarifa. Todos los proveedores tienen ID y licencia verificada.",
    step2Title: "Contacto directo",
    step2Sub: "Llame o envíe mensaje directamente. Sin intermediarios.",
    step3Title: "Contrate en sus términos",
    step3Sub: "Usted decide el pago, cuándo empezar y cuánto tiempo trabajar.",
    agencyReports: "Informes de agencia",
    agencyLocked: "Agencia de cuidado verificada",
    agencyLockedSub: "Información de contacto visible para miembros y usuarios Aide Pro.",
    agencyUnlockBtn: "🔒 Desbloquear contacto de agencia",
    agencyDashTitle: "Informes de agencia",
    agencyDashSub: "Actividad real de familias buscando cuidado — últimos 30 días.",
    hotAides: "Cuidadores populares — últimos 30 días",
    hotAidesSub: "Qué cuidadores están viendo y contactando más las familias.",
    marketDemand: "Dónde se busca cuidado",
    marketDemandSub: "Códigos postales con más búsquedas.",
    tblRank: "#", tblAide: "Cuidador", tblLocation: "Ubicación",
    tblViews: "Vistas", tblContacts: "Contactos", tblRate: "Tasa de contacto",
    tblZip: "CP", tblSearches: "Búsquedas", tblResults: "Resultados prom.",
    reportEmpty: "Sin actividad en los últimos 30 días.",
    upgradeCta: "🔒 Desbloquee el informe completo",
    upgradeBtn: "Actualizar a informe completo",
    demoSeedBtn: "Cargar datos de demo",
    demoSeedDone: "Eventos de demo creados:",
    demoSeedFail: "Falló la carga — revise la consola.",
    hiredBtn: "✓ Contraté a este cuidador",
    hireFormLabel: "Su nombre (se mostrará con su futura reseña)",
    hireConfirm: "Confirmar contratación",
    tHired: "🎉 ¡Felicidades por su elección! Puede dejar una reseña cuando quiera.",
    hiredBadge: "✓ Contratado vía Kajing Care",
    reviews: "Reseñas", writeReview: "Escribir una reseña",
    commentPh: "¿Cómo fue el servicio? Puntualidad, calidad, comunicación…",
    submitReview: "Enviar reseña", noReviews: "Aún no hay reseñas.",
    errReview: "Seleccione una calificación e ingrese su nombre.",
    tReview: "Gracias — su reseña fue publicada ✓",
    faqTitle: "Preguntas Frecuentes", faqClientTitle: "Para Familias", faqAideTitle: "Para Cuidadores", faqLink: "Preguntas", whyMembership: "¿Por qué la membresía?",
    fPrivacy: "Política de privacidad", fTerms: "Términos de servicio", fBackup: "Copia de seguridad (pruebas)",
    fCopy: "© 2026 Kajing Care 家政通. Las familias son responsables de verificar y contratar.",
    tProfileLive: "Su perfil fue enviado para revisión — aparecerá en el directorio una vez verificado ✓",
    verifiedBadge: "✓ Verificado", tProfileUpd: "Perfil actualizado ✓", tProfileRem: "Perfil eliminado.",
    tJobLive: "¡Su solicitud está publicada! 🎉", tJobUpd: "Solicitud actualizada ✓", tJobRem: "Solicitud eliminada.",
    tMember: "Membresía activa — contactos desbloqueados ✓",
  },
};

const SERVICE_I18N = {
  "Personal care": { zh: "個人護理", es: "Cuidado personal" },
  "Meal preparation": { zh: "備餐", es: "Preparación de comidas" },
  "Medication reminders": { zh: "用藥提醒", es: "Recordatorio de medicamentos" },
  "Mobility assistance": { zh: "行動輔助", es: "Ayuda con movilidad" },
  "Companionship": { zh: "陪伴", es: "Compañía" },
  "Light housekeeping": { zh: "輕度家務", es: "Limpieza ligera" },
  "Transportation": { zh: "接送交通", es: "Transporte" },
  "Dementia care": { zh: "失智照護", es: "Cuidado de demencia" },
  "Child care": { zh: "兒童照護", es: "Cuidado infantil" },
  "Infant care": { zh: "嬰幼兒照護", es: "Cuidado de bebés" },
  "After-school care": { zh: "課後看顧", es: "Cuidado después de clases" },
  "Special needs care": { zh: "特殊需求照護", es: "Cuidado de necesidades especiales" },
  "Laundry": { zh: "洗衣", es: "Lavandería" },
  "Errands & shopping": { zh: "跑腿採買", es: "Mandados y compras" },
  "Pet care": { zh: "寵物照顧", es: "Cuidado de mascotas" },
  "Post-surgery care": { zh: "術後照護", es: "Cuidado postoperatorio" },
  "Overnight care": { zh: "夜間照護", es: "Cuidado nocturno" },
  "Live-in care": { zh: "住家看護", es: "Cuidado interno" },
  "Respite care": { zh: "喘息照護", es: "Cuidado de relevo" },
  "CPR / First Aid": { zh: "心肺復甦／急救", es: "RCP / Primeros auxilios" },
  "Dementia care training": { zh: "失智照護訓練", es: "Formación en demencia" },
  // Languages (v3.7.2)
  "English":         { zh: "英語",         es: "Inglés" },
  "Mandarin":        { zh: "普通話",       es: "Mandarín" },
  "Cantonese":       { zh: "廣東話",       es: "Cantonés" },
  "Fujianese":       { zh: "福建話",       es: "Fujianés" },
  "Taishanese":      { zh: "台山話",       es: "Taishanés" },
  "Shanghainese":    { zh: "上海話",       es: "Shanghainés" },
  "Spanish":         { zh: "西班牙語",     es: "Español" },
  "Korean":          { zh: "韓語",         es: "Coreano" },
  "Russian":         { zh: "俄語",         es: "Ruso" },
  "Polish":          { zh: "波蘭語",       es: "Polaco" },
  "Haitian Creole":  { zh: "海地克里奧爾語", es: "Criollo haitiano" },
  "Tagalog":         { zh: "菲律賓他加祿語", es: "Tagalo" },
  "Vietnamese":      { zh: "越南語",       es: "Vietnamita" },
  "Bengali":         { zh: "孟加拉語",     es: "Bengalí" },
};

let LANG_CURRENT = { lang: "en", L: STRINGS.en, ts: (s) => s };
function useLang() { return LANG_CURRENT; }


// ---------- Helpers ----------
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Downscale + compress the selfie so it fits comfortably in storage
function compressImage(file, maxSize = 420) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- Supabase (permanent database) ----------
const APP_VERSION = "v3.10.1"; // ← bumped on every code update

const SUPABASE_URL = "https://vypbvydettsihtbelqhx.supabase.co";
const SUPABASE_KEY = "sb_publishable_tF0jsQrFs27d2RObzbH2WQ_k8AYRWF6";
const sbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

async function sbSelect(table, extra = "") {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc${extra}`, { headers: sbHeaders });
  if (!r.ok) throw new Error(`load ${table} failed: ${r.status}`);
  return r.json();
}
async function sbInsert(table, row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...sbHeaders, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`insert ${table} failed: ${r.status}`);
  return (await r.json())[0];
}
async function sbUpdate(table, id, row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...sbHeaders, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    console.warn(`[KJC] update ${table} failed:`, r.status, t);
    throw new Error(`update ${table} failed: ${r.status}${t ? ` — ${t}` : ""}`);
  }
  return (await r.json())[0];
}
async function sbUpsert(table, rows) {
  if (!rows || rows.length === 0) return 0;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=id`, {
    method: "POST",
    headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(rows),
  });
  if (!r.ok) throw new Error(`restore ${table} failed: ${r.status}`);
  return rows.length;
}

async function sbDelete(table, id) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: sbHeaders,
  });
  if (!r.ok) throw new Error(`delete ${table} failed: ${r.status}`);
}

// ---------- Analytics tracking (fire-and-forget mouse-trap events) ----------
// Anonymous browser session ID — stable across visits, no personal data
function getSessionId() {
  let sid = localStorage.getItem("kjc_sid");
  if (!sid) {
    sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    localStorage.setItem("kjc_sid", sid);
  }
  return sid;
}

// Mouse trap 1: search submitted. Returns search_query_id for chaining.
async function trackSearch({ zip, service, maxRate, ageFrom, ageTo, resultsCount, lang, memberSession }) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/search_queries`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "return=representation" },
      body: JSON.stringify({
        session_id:     getSessionId(),
        actor_type:     memberSession ? "member" : "guest",
        actor_id:       memberSession?.id || null,
        zip_filter:     zip || null,
        service_filter: service || null,
        max_rate:       maxRate ? Number(maxRate) : null,
        age_from:       ageFrom ? Number(ageFrom) : null,
        age_to:         ageTo ? Number(ageTo) : null,
        results_count:  resultsCount || 0,
        lang:           lang || "en",
      }),
    });
    if (r.ok) {
      const rows = await r.json();
      return rows[0]?.id || null;
    }
  } catch (_) { /* tracking must never break the UI */ }
  return null;
}

// Mouse trap 2: "View profile & contact" clicked (card expanded).
// Returns profile_view_id for chaining to contact reveal.
async function trackProfileView({ caregiverId, caregiverName, searchQueryId, memberSession }) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/profile_views`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "return=representation" },
      body: JSON.stringify({
        session_id:      getSessionId(),
        actor_type:      memberSession ? "member" : "guest",
        actor_id:        memberSession?.id || null,
        caregiver_id:    caregiverId,
        caregiver_name:  caregiverName,
        search_query_id: searchQueryId || null,
      }),
    });
    if (r.ok) {
      const rows = await r.json();
      return rows[0]?.id || null;
    }
  } catch (_) {}
  return null;
}

// Mouse trap 3: "Unlock contact info" clicked — fires BEFORE contact is shown.
async function trackContactReveal({ caregiverId, caregiverName, profileViewId, searchQueryId, wasSubscribed, memberSession }) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/contact_reveals`, {
      method: "POST",
      headers: sbHeaders,
      body: JSON.stringify({
        session_id:      getSessionId(),
        actor_type:      memberSession ? "member" : "guest",
        actor_id:        memberSession?.id || null,
        caregiver_id:    caregiverId,
        caregiver_name:  caregiverName,
        profile_view_id: profileViewId || null,
        search_query_id: searchQueryId || null,
        was_subscribed:  !!wasSubscribed,
      }),
    });
  } catch (_) {}
}

async function sbUploadPhoto(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const name = `p${Date.now()}${Math.random().toString(36).slice(2, 8)}.jpg`;
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/photos/${name}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "image/jpeg" },
    body: blob,
  });
  if (!r.ok) throw new Error("photo upload failed");
  return `${SUPABASE_URL}/storage/v1/object/public/photos/${name}`;
}

// ---------- Member accounts (Supabase Auth) ----------
// ---------- Phone Auth (v3.4) — PIN-based sign in ----------
// PHONE_AUTH_MODE:
//   "pin" — PIN-based auth (default). No SMS, no Twilio. Uses bcrypt via pgcrypto.
//   "otp" — SMS OTP via Supabase + Twilio. Enable when Twilio is configured.
const PHONE_AUTH_MODE = "pin";
const PIN_LENGTH = 6;      // 4 or 6 — 6 is 100x harder to guess

// E.164 formatter: normalize any US phone to "+1XXXXXXXXXX"
function toE164(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (raw?.trim().startsWith("+")) return raw.trim();
  return "+" + digits;
}

// Send OTP via SMS (Supabase → Twilio) — only used when PHONE_AUTH_MODE === "otp"
async function sendPhoneOtp(phone) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify({ phone: toE164(phone), channel: "sms" }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.msg || d.error_description || "Could not send code");
}

// Verify OTP and get a Supabase session — only used when PHONE_AUTH_MODE === "otp"
async function verifyPhoneOtp(phone, token) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify({ phone: toE164(phone), token, type: "sms" }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.msg || d.error_description || "Wrong code");
  return d; // { access_token, refresh_token, user }
}

// ---- PIN-based auth (v3.4) ----
// All three call PostgreSQL SECURITY DEFINER functions that verify PINs
// server-side. The browser never sees any hash.

async function checkPhoneRegistered(phone) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_phone`, {
    method: "POST",
    headers: { ...sbHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ p_phone: toE164(phone) }),
  });
  if (!r.ok) throw new Error("Lookup failed");
  return await r.json(); // true | false
}

async function signupWithPin(phone, pin, name, role) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/signup_with_pin`, {
    method: "POST",
    headers: { ...sbHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      p_phone: toE164(phone),
      p_pin: pin,
      p_display_name: name || "",
      p_role: role,
    }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.message || d.msg || "Sign up failed");
  const row = Array.isArray(d) ? d[0] : d;
  return { id: row.out_user_id, role: row.out_role, name: row.out_display_name || name || "", phone: row.out_phone };
}

async function signinWithPin(phone, pin) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/signin_with_pin`, {
    method: "POST",
    headers: { ...sbHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ p_phone: toE164(phone), p_pin: pin }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.message || d.msg || "Wrong phone or PIN");
  const row = Array.isArray(d) ? d[0] : d;
  return { id: row.out_user_id, role: row.out_role, name: row.out_display_name || "", phone: row.out_phone };
}

// Fetch this user's role/name from user_profiles
async function fetchUserProfile(userId) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${userId}&select=*`,
    { headers: sbHeaders }
  );
  if (!r.ok) return null;
  const rows = await r.json();
  return rows[0] || null;
}

// Create or update this user's profile (first-time role picker, name edits)
async function upsertUserProfile(profile) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
    method: "POST",
    headers: {
      ...sbHeaders,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(profile),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error("Save profile failed: " + t);
  }
  const rows = await r.json();
  return rows[0];
}

async function authSignup(email, password, name) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, data: { name } }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.msg || d.error_description || "signup failed");
  return d;
}
async function authLogin(email, password) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error_description || d.msg || "login failed");
  return d;
}
// ---------- Analytics fetchers (v3.6) — Agency dashboard ----------
async function fetchAideLeaderboard(limit = 20, days = 30) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_aide_leaderboard`, {
      method: "POST",
      headers: { ...sbHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ p_limit: limit, p_days: days }),
    });
    if (!r.ok) { console.warn("[KJC] leaderboard failed:", r.status); return []; }
    return (await r.json()) || [];
  } catch (e) { console.warn("[KJC] leaderboard error:", e); return []; }
}

async function fetchSearchDemand(limit = 20, days = 30) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_search_demand`, {
      method: "POST",
      headers: { ...sbHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ p_limit: limit, p_days: days }),
    });
    if (!r.ok) { console.warn("[KJC] demand failed:", r.status); return []; }
    return (await r.json()) || [];
  } catch (e) { console.warn("[KJC] demand error:", e); return []; }
}

async function seedDemoEvents() {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/seed_demo_events`, {
      method: "POST",
      headers: { ...sbHeaders, "Content-Type": "application/json" },
      body: "{}",
    });
    if (!r.ok) { const t = await r.text().catch(() => ""); throw new Error(t || "seed failed"); }
    return await r.json();
  } catch (e) { throw e; }
}

// v3.8 — count of caregivers awaiting admin approval (SECURITY DEFINER RPC)
async function fetchPendingCount() {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_pending_count`, {
      method: "POST",
      headers: { ...sbHeaders, "Content-Type": "application/json" },
      body: "{}",
    });
    if (!r.ok) return 0;
    const n = await r.json();
    return typeof n === "number" ? n : 0;
  } catch (e) { return 0; }
}

// v3.7 — look up an existing caregiver record by phone (for aide sign-in routing)
async function findCaregiverByPhone(phone) {
  try {
    const clean = (phone || "").replace(/[^\d+]/g, "");
    if (!clean) return null;
    // Try exact match first; caregivers table may store various formats
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/caregivers?phone=eq.${encodeURIComponent(clean)}&select=*&limit=1`,
      { headers: sbHeaders }
    );
    if (!r.ok) return null;
    const arr = await r.json();
    if (arr[0]) return aideFromDb(arr[0]);
    // Fallback: try without country code
    if (clean.startsWith("+1") && clean.length >= 12) {
      const local = clean.slice(2);
      const r2 = await fetch(
        `${SUPABASE_URL}/rest/v1/caregivers?phone=eq.${encodeURIComponent(local)}&select=*&limit=1`,
        { headers: sbHeaders }
      );
      if (!r2.ok) return null;
      const arr2 = await r2.json();
      return arr2[0] ? aideFromDb(arr2[0]) : null;
    }
    return null;
  } catch (e) {
    console.warn("[KJC] findCaregiverByPhone error:", e);
    return null;
  }
}

// v3.7.1 — build a form-shaped empty aide record from an account (for first-time signup)
function emptyAideFromAccount(acct) {
  return {
    name: acct?.name || "",
    phone: acct?.phone || "",
    email: "", city: "", zip: "",
    age: "", years: "", rate: "",
    languages: "", bio: "",
    services: [], certs: [],
    photo: null, certPhoto: null, pin: "",
  };
}

async function fetchMember(userId) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_member`, {
      method: "POST",
      headers: { ...sbHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ p_user_id: userId }),
    });
    if (!r.ok) {
      console.warn("[KJC] fetchMember failed:", r.status);
      return null;
    }
    const arr = await r.json();
    return arr[0] || null;
  } catch (e) {
    console.warn("[KJC] fetchMember error:", e);
    return null;
  }
}
async function upsertMember(row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/members?on_conflict=user_id`, {
    method: "POST",
    headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error("member save failed");
  return (await r.json())[0];
}

// Map between app records and database rows
const numOrNull = (v) => (v === "" || v == null || isNaN(Number(v)) ? null : Number(v));
const strOf = (v) => (v == null ? "" : String(v));

const aideToDb = (a) => ({
  name: a.name, phone: a.phone, email: a.email || null, city: a.city, zip: a.zip || null,
  age: numOrNull(a.age), years: numOrNull(a.years), rate: numOrNull(a.rate),
  languages: a.languages || null, bio: a.bio || null,
  services: a.services || [], certs: a.certs || [], photo_url: a.photo || null, cert_photo_url: a.certPhoto || null,
  ...(a.pin ? { pin: a.pin } : {}),
});
const aideFromDb = (r) => ({
  id: r.id, createdAt: new Date(r.created_at).getTime(),
  name: r.name || "", phone: r.phone || "", email: r.email || "", city: r.city || "", zip: r.zip || "",
  age: strOf(r.age), years: strOf(r.years), rate: strOf(r.rate),
  languages: r.languages || "", bio: r.bio || "",
  services: r.services || [], certs: r.certs || [], photo: r.photo_url || null, certPhoto: r.cert_photo_url || null, pin: r.pin || "", approved: !!r.approved, featured: !!r.featured,
});
const jobToDb = (j) => ({
  title: j.title, name: j.name, phone: j.phone, email: j.email || null, city: j.city, zip: j.zip || null,
  schedule: j.schedule || null, rate: numOrNull(j.rate),
  services: j.services || [], details: j.details || null, pin: j.pin || null,
});
const jobFromDb = (r) => ({
  id: r.id, createdAt: new Date(r.created_at).getTime(),
  title: r.title || "", name: r.name || "", phone: r.phone || "", email: r.email || "",
  city: r.city || "", zip: r.zip || "", schedule: r.schedule || "", rate: strOf(r.rate),
  services: r.services || [], details: r.details || "", pin: r.pin || "",
});

const loadAides = async () => (await sbSelect("caregivers", "&approved=eq.true")).map(aideFromDb).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
const loadJobs = async () => (await sbSelect("care_requests")).map(jobFromDb);
const loadReviews = async () => {
  try { return await sbSelect("reviews"); } catch (e) { return []; }
};
const loadHires = async () => {
  try { return await sbSelect("hires"); } catch (e) { return []; }
};
const loadAgencies = async () => {
  try {
    const rows = await sbSelect("agencies", "&active=eq.true");
    const today = new Date().toISOString().slice(0, 10);
    return rows.filter((a) => !a.paid_until || a.paid_until >= today);
  } catch (e) { return []; }
};


// ---------- Small UI pieces ----------
const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  fontSize: 16,
  border: `1.5px solid ${T.line}`,
  borderRadius: 10,
  background: "#FDFDFC",
  color: T.ink,
  outline: "none",
  fontFamily: "inherit",
};

function Field({ label, children, required }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 6 }}>
        {label} {required && <span style={{ color: T.danger }}>*</span>}
      </span>
      {children}
    </label>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        border: `1.5px solid ${active ? T.primary : T.line}`,
        background: active ? T.primary : "#fff",
        color: active ? "#fff" : T.ink,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

// ---------- Registration form ----------
function RegisterForm({ onSaved, onCancel, initial, hidePin = false }) {
  const { L, ts } = useLang();
  const [form, setForm] = useState(
    initial || {
      name: "",
      phone: "",
      email: "",
      city: "",
      zip: "",
      age: "",
      years: "",
      rate: "",
      languages: "",
      bio: "",
      services: [],
      certs: [],
      photo: null,
      certPhoto: null,
      pin: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef(null);
  const certFileRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k, item) =>
    setForm((f) => ({
      ...f,
      [k]: f[k].includes(item) ? f[k].filter((x) => x !== item) : [...f[k], item],
    }));

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    setError("");
    try {
      const dataUrl = await compressImage(file);
      set("photo", dataUrl);
    } catch (err) {
      setError("Could not read that photo. Please try again.");
    }
    setPhotoBusy(false);
  }

  async function handleCertPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    setError("");
    try {
      const dataUrl = await compressImage(file, 900); // higher resolution so the license text stays readable
      set("certPhoto", dataUrl);
    } catch (err) {
      setError("Could not read that photo. Please try again.");
    }
    setPhotoBusy(false);
  }

  async function save() {
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim()) {
      setError(L.errReq);
      return;
    }
    if (!/^\d{5}$/.test((form.zip || "").trim())) {
      setError(L.errZip);
      return;
    }
    if (!form.photo) {
      setError(L.errPhoto);
      return;
    }
    if (!hidePin && !/^\d{4}$/.test(form.pin || "")) {
      setError(L.errPin);
      return;
    }
    setSaving(true);
    setError("");
    try {
      let photoUrl = form.photo;
      if (photoUrl && photoUrl.startsWith("data:")) {
        try { photoUrl = await sbUploadPhoto(photoUrl); } catch (e) { /* keep inline photo as fallback */ }
      }
      let certUrl = form.certPhoto;
      if (certUrl && certUrl.startsWith("data:")) {
        try { certUrl = await sbUploadPhoto(certUrl); } catch (e) { /* keep inline as fallback */ }
      }
      const row = aideToDb({ ...form, photo: photoUrl, certPhoto: certUrl });
      const saved = initial?.id
        ? await sbUpdate("caregivers", initial.id, row)
        : await sbInsert("caregivers", row);
      onSaved(aideFromDb(saved));
    } catch (e) {
      setError(L.errSave);
      setSaving(false);
    }
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {initial ? L.updTitle : L.regTitle}
      </h2>
      <p style={{ margin: "0 0 20px", color: T.inkSoft, fontSize: 15 }}>
        {initial ? L.updSub : L.regSub}
      </p>
      {initial && initial.approved === false && (
        <p style={{ margin: "-8px 0 16px", padding: "10px 12px", background: "#FCF4E3", border: `1px solid ${T.amber}`, borderRadius: 10, fontSize: 13.5, color: T.ink, lineHeight: 1.5 }}>
          {L.pendingEdit}
        </p>
      )}

      {/* Selfie */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div
          style={{
            width: 96, height: 96, borderRadius: "50%", flexShrink: 0,
            background: T.surface, border: `2px dashed ${form.photo ? T.primary : T.line}`,
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {form.photo ? (
            <img src={form.photo} alt="Your profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 34 }}>📷</span>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={photoBusy}
            style={{
              padding: "10px 16px", borderRadius: 10, border: "none",
              background: T.primary, color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {photoBusy ? L.processing : form.photo ? L.retake : L.selfie}
          </button>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: T.inkSoft }}>
            {L.cameraNote}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handlePhoto}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <Field label={L.lName} required>
        <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Maria Chen" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={L.lPhone} required>
          <input style={inputStyle} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 555-1234" />
        </Field>
        <Field label={L.lEmail}>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <Field label={L.lCity} required>
          <input style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ashburn, VA" />
        </Field>
        <Field label={L.lZip} required>
          <input style={inputStyle} inputMode="numeric" maxLength={5} value={form.zip} onChange={(e) => set("zip", e.target.value.replace(/\D/g, ""))} placeholder="20147" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Field label={L.lAge}>
          <input style={inputStyle} inputMode="numeric" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="45" />
        </Field>
        <Field label={L.lYrs}>
          <input style={inputStyle} inputMode="numeric" value={form.years} onChange={(e) => set("years", e.target.value)} placeholder="5" />
        </Field>
        <Field label={L.lRate}>
          <input style={inputStyle} inputMode="numeric" value={form.rate} onChange={(e) => set("rate", e.target.value)} placeholder="25" />
        </Field>
      </div>

      <Field label={L.lLang}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {LANGUAGES.map((lang) => {
            const current = form.languages
              ? String(form.languages).split(/[,;]/).map((s) => s.trim()).filter(Boolean)
              : [];
            const active = current.includes(lang);
            return (
              <Chip
                key={lang}
                label={ts(lang)}
                active={active}
                onClick={() => {
                  const next = active ? current.filter((l) => l !== lang) : [...current, lang];
                  set("languages", next.join(", "));
                }}
              />
            );
          })}
        </div>
      </Field>

      <Field label={L.lServices}>
        {SERVICE_GROUPS.map(([gk, items]) => (
          <div key={gk} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.inkSoft, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>{L[gk]}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items.map((s) => (
                <Chip key={s} label={ts(s)} active={form.services.includes(s)} onClick={() => toggle("services", s)} />
              ))}
            </div>
          </div>
        ))}
      </Field>

      <Field label={L.lCerts}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CERTS.map((c) => (
            <Chip key={c} label={ts(c)} active={form.certs.includes(c)} onClick={() => toggle("certs", c)} />
          ))}
        </div>
      </Field>

      <Field label={L.lCertPhoto}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 110, height: 74, borderRadius: 10, flexShrink: 0, background: T.surface, border: `2px dashed ${form.certPhoto ? T.primary : T.line}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {form.certPhoto ? (
              <img src={form.certPhoto} alt="License" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 26 }}>📄</span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => certFileRef.current?.click()}
              disabled={photoBusy}
              style={{ padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${T.primary}`, background: "#fff", color: T.primary, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              {form.certPhoto ? L.certRetake : L.certUpload}
            </button>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: T.inkSoft }}>{L.certPhotoNote}</p>
            <input ref={certFileRef} type="file" accept="image/*" capture="environment" onChange={handleCertPhoto} style={{ display: "none" }} />
          </div>
        </div>
      </Field>

      <Field label={L.lAbout}>
        <textarea
          style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="A few sentences about your experience and approach to caregiving."
        />
      </Field>

      {!hidePin && (
        <Field label={L.lPin} required>
          <input
            style={{ ...inputStyle, maxWidth: 160, letterSpacing: 4 }}
            inputMode="numeric"
            maxLength={4}
            value={form.pin || ""}
            onChange={(e) => set("pin", e.target.value.replace(/\D/g, ""))}
            placeholder="••••"
          />
        </Field>
      )}

      {error && (
        <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none",
            background: saving ? T.inkSoft : T.primary, color: "#fff",
            fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {saving ? L.saving : initial ? L.save : L.publish}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${T.line}`,
            background: "#fff", color: T.ink, fontSize: 16, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {L.cancel}
        </button>
      </div>
      <p style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 12, marginBottom: 0 }}>
        {L.noteShared}
      </p>
    </div>
  );
}

// ---------- Directory ----------
function AideCard({ aide, onDelete, onEdit, subscribed, onRequireSub, reviews = [], onAddReview, hires = [], onHire, hireDefault = "", searchQueryId = null, memberSession = null }) {
  const { L, ts } = useLang();
  const [hireOpen, setHireOpen] = useState(false);
  const [hireName, setHireName] = useState(hireDefault || "");
  const [hireBusy, setHireBusy] = useState(false);
  const [hiredNow, setHiredNow] = useState(false);

  async function doHire() {
    if (!hireName.trim()) return;
    setHireBusy(true);
    try {
      await onHire(aide.id, hireName.trim());
      setHiredNow(true);
      setHireOpen(false);
      setRevName(hireName.trim());
      setRevOpen(true);
    } catch (e) { /* toast shown by parent */ }
    setHireBusy(false);
  }
  const [revOpen, setRevOpen] = useState(false);
  const [revRating, setRevRating] = useState(0);
  const [revName, setRevName] = useState("");
  const [revComment, setRevComment] = useState("");
  const [revError, setRevError] = useState("");
  const [revBusy, setRevBusy] = useState(false);
  const [currentViewId, setCurrentViewId] = useState(null);   // tracking: profile_view id
  const [contactRevealed, setContactRevealed] = useState(false); // v3.5 mouse-trap: phone hidden until click
  const avg = reviews.length ? (reviews.reduce((t, r) => t + r.rating, 0) / reviews.length).toFixed(1) : null;

  async function submitReview() {
    if (!revRating || !revName.trim()) { setRevError(L.errReview); return; }
    setRevBusy(true);
    setRevError("");
    try {
      await onAddReview(aide.id, { name: revName.trim(), rating: revRating, comment: revComment.trim() });
      setRevOpen(false); setRevRating(0); setRevComment("");
    } catch (e) {
      setRevError(L.errSave);
    }
    setRevBusy(false);
  }
  const [expanded, setExpanded] = useState(false);
  const [pinAction, setPinAction] = useState(null); // null | "edit" | "delete"
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");

  function requestAction(action) {
    // Older demo profiles created before PINs existed can be managed directly
    if (!aide.pin) {
      action === "edit" ? onEdit(aide) : onDelete(aide);
      return;
    }
    setPinAction(action);
    setPinValue("");
    setPinError("");
  }

  function confirmPin() {
    if (pinValue === aide.pin) {
      const action = pinAction;
      setPinAction(null);
      action === "edit" ? onEdit(aide) : onDelete(aide);
    } else {
      setPinError(L.pinBad);
    }
  }

  return (
    <div
      style={{
        background: T.card, borderRadius: 16, border: `1px solid ${T.line}`,
        padding: 16, marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: T.surface, border: `2px solid ${T.amber}` }}>
          {aide.photo ? (
            <img src={aide.photo} alt={aide.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🧑</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: T.ink }}>
            {subscribed ? aide.name : L.teaserName}
            {aide.featured && <span style={{ color: "#3A2A08", background: T.amber, fontWeight: 800, fontSize: 11.5, marginLeft: 8, padding: "2px 8px", borderRadius: 999, verticalAlign: "middle" }}>{L.featuredBadge}</span>}
            <span style={{ color: "#fff", background: T.primary, fontWeight: 800, fontSize: 11.5, marginLeft: 8, padding: "2px 8px", borderRadius: 999, verticalAlign: "middle" }}>{L.verifiedBadge}</span>
            {avg && <span style={{ color: T.amber, fontWeight: 800, fontSize: 14.5, marginLeft: 8 }}>★ {avg} ({reviews.length})</span>}
          </div>
          <div style={{ fontSize: 14, color: T.inkSoft }}>
            {aide.city}{aide.age ? ` · ${L.ageLbl} ${aide.age}` : ""}{aide.years ? ` · ${aide.years} ${L.yrsExp}` : ""}{aide.rate ? ` · $${aide.rate}/hr` : ""}
          </div>
          {aide.languages && (
            <div style={{ fontSize: 13.5, color: T.primary, fontWeight: 600 }}>{L.speaks} {aide.languages}</div>
          )}
        </div>
      </div>

      {aide.services?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {aide.services.slice(0, expanded ? undefined : 4).map((s) => (
            <span key={s} style={{ fontSize: 12.5, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: T.surface, color: T.ink, border: `1px solid ${T.line}` }}>
              {ts(s)}
            </span>
          ))}
          {!expanded && aide.services.length > 4 && (
            <span style={{ fontSize: 12.5, color: T.inkSoft, padding: "4px 4px" }}>+{aide.services.length - 4} more</span>
          )}
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: 12, fontSize: 14.5, color: T.ink }}>
          {aide.certs?.length > 0 && (
            <p style={{ margin: "0 0 8px" }}>
              <strong>{L.certified}</strong> {aide.certs.map(ts).join(", ")}
            </p>
          )}
          {aide.bio && <p style={{ margin: "0 0 8px", color: T.inkSoft }}>{aide.bio}</p>}
          {subscribed ? (
            contactRevealed ? (
              <p style={{ margin: 0 }}>
                <strong>{L.contactLbl}</strong>{" "}
                <a href={"tel:" + aide.phone} style={{ color: T.primary, fontWeight: 700 }}>{aide.phone}</a>
                {aide.email ? <> · <a href={"mailto:" + aide.email} style={{ color: T.primary }}>{aide.email}</a></> : null}
              </p>
            ) : (
              <div style={{ padding: 12, background: "#EFF6F3", borderRadius: 10, border: `1px solid ${T.primary}` }}>
                <p style={{ margin: "0 0 8px", fontSize: 13.5, color: T.inkSoft }}>
                  {L.contactHidden}
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    // Fire the mouse-trap event BEFORE revealing so we always capture intent
                    await trackContactReveal({
                      caregiverId:   aide.id,
                      caregiverName: aide.name,
                      profileViewId: currentViewId,
                      searchQueryId,
                      wasSubscribed: true,
                      memberSession,
                    });
                    setContactRevealed(true);
                  }}
                  style={{
                    padding: "9px 14px", borderRadius: 10, border: "none", background: T.primary,
                    color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  📞 {L.viewContact}
                </button>
              </div>
            )
          ) : (
            <div style={{ padding: 12, background: T.surface, borderRadius: 10, border: `1px dashed ${T.line}` }}>
              <p style={{ margin: "0 0 8px", fontSize: 14, color: T.ink }}>
                🔒 {L.lockedLine}
              </p>
              <button
                type="button"
                onClick={async () => {
                  await trackContactReveal({
                    caregiverId:   aide.id,
                    caregiverName: aide.name,
                    profileViewId: currentViewId,
                    searchQueryId,
                    wasSubscribed: false,
                    memberSession,
                  });
                  onRequireSub();
                }}
                style={{
                  padding: "10px 16px", borderRadius: 10, border: "none", background: T.amber,
                  color: "#3A2A08", fontWeight: 800, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {L.unlock}
              </button>
            </div>
          )}

          {/* I hired this caregiver */}
          {subscribed && !hiredNow && (
            hireOpen ? (
              <div style={{ marginTop: 12, padding: 12, background: "#EFF6F3", borderRadius: 10, border: `1px solid ${T.primary}` }}>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: T.ink, marginBottom: 6 }}>{L.hireFormLabel}</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input style={{ ...inputStyle, padding: "9px 12px", flex: "1 1 140px" }} value={hireName} onChange={(e) => setHireName(e.target.value)} placeholder={L.lYourName} />
                  <button type="button" disabled={hireBusy} onClick={doHire}
                    style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: T.primary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    {hireBusy ? L.saving : L.hireConfirm}
                  </button>
                  <button type="button" onClick={() => setHireOpen(false)}
                    style={{ padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    {L.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setHireOpen(true)}
                style={{ marginTop: 12, width: "100%", padding: "11px", borderRadius: 10, border: `1.5px dashed ${T.primary}`, background: "#fff", color: T.primary, fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit" }}>
                {L.hiredBtn}
              </button>
            )
          )}

          {/* Reviews */}
          <div style={{ marginTop: 14, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: T.ink, marginBottom: 8 }}>
              {L.reviews}{avg && <span style={{ color: T.amber, marginLeft: 8 }}>★ {avg} · {reviews.length}</span>}
            </div>
            {reviews.length === 0 && (
              <p style={{ margin: "0 0 8px", fontSize: 13.5, color: T.inkSoft }}>{L.noReviews}</p>
            )}
            {reviews.map((r) => (
              <div key={r.id} style={{ padding: "10px 12px", background: T.surface, borderRadius: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 13.5 }}>
                  <span style={{ color: T.amber, letterSpacing: 1 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  {"  "}<strong style={{ color: T.ink }}>{r.reviewer_name}</strong>
                  {hires.some((h) => h.client_name && r.reviewer_name && h.client_name.trim().toLowerCase() === r.reviewer_name.trim().toLowerCase()) && (
                    <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: T.primary, border: `1px solid ${T.primary}`, borderRadius: 999, padding: "1px 7px" }}>{L.hiredBadge}</span>
                  )}
                  {"  "}<span style={{ color: T.inkSoft, fontSize: 12.5 }}>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.comment && <p style={{ margin: "6px 0 0", fontSize: 14, color: T.ink, lineHeight: 1.45 }}>{r.comment}</p>}
              </div>
            ))}
            {revOpen && subscribed ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => { setRevRating(n); setRevError(""); }}
                      style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: n <= revRating ? T.amber : T.line, padding: "0 2px" }}>
                      ★
                    </button>
                  ))}
                </div>
                <input style={{ ...inputStyle, marginBottom: 8 }} placeholder={L.lYourName} value={revName} onChange={(e) => setRevName(e.target.value)} />
                <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical", marginBottom: 8 }} placeholder={L.commentPh} value={revComment} onChange={(e) => setRevComment(e.target.value)} />
                {revError && <p style={{ color: T.danger, fontSize: 13.5, fontWeight: 600, margin: "0 0 8px" }}>{revError}</p>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" disabled={revBusy} onClick={submitReview}
                    style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: T.primary, color: "#fff", fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit" }}>
                    {revBusy ? L.saving : L.submitReview}
                  </button>
                  <button type="button" onClick={() => setRevOpen(false)}
                    style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    {L.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => (subscribed ? setRevOpen(true) : onRequireSub())}
                style={{ marginTop: 4, padding: "10px 16px", borderRadius: 10, border: `1.5px solid ${T.primary}`, background: "#fff", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                {subscribed ? L.writeReview : "🔒 " + L.writeReview}
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={async () => {
            if (!subscribed) {
              // Guest: fire contact_reveal (they're being sent to plans page)
              await trackContactReveal({
                caregiverId:   aide.id,
                caregiverName: aide.name,
                profileViewId: currentViewId,
                searchQueryId,
                wasSubscribed: false,
                memberSession,
              });
              onRequireSub();
              return;
            }
            if (!expanded) {
              // Member expanding the card — fire profile_view mouse trap only.
              // contact_reveal fires later when they click "Show contact info".
              const pvId = await trackProfileView({
                caregiverId:   aide.id,
                caregiverName: aide.name,
                searchQueryId,
                memberSession,
              });
              setCurrentViewId(pvId);
            }
            setExpanded(!expanded);
            if (expanded) setContactRevealed(false); // collapsing re-hides contact
          }}
          style={{
            flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${T.primary}`,
            background: expanded ? T.primary : "#fff", color: expanded ? "#fff" : T.primary,
            fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {subscribed ? (expanded ? L.showLess : L.viewProfile) : "🔒 " + L.viewProfile}
        </button>
        <button
          type="button"
          onClick={() => requestAction("edit")}
          title="Edit profile (owner only)"
          style={{
            padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`,
            background: "#fff", color: T.inkSoft, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {L.editBtn}
        </button>
        <button
          type="button"
          onClick={() => requestAction("delete")}
          title="Remove profile (owner only)"
          style={{
            padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`,
            background: "#fff", color: T.inkSoft, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ✕
        </button>
      </div>

      {pinAction && (
        <div style={{ marginTop: 10, padding: 12, background: T.surface, borderRadius: 10, border: `1px solid ${T.line}` }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: T.ink, marginBottom: 6 }}>
            {L.pinPrompt}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...inputStyle, maxWidth: 120, letterSpacing: 4, padding: "9px 12px" }}
              inputMode="numeric"
              maxLength={4}
              value={pinValue}
              onChange={(e) => { setPinValue(e.target.value.replace(/\D/g, "")); setPinError(""); }}
              placeholder="••••"
            />
            <button
              type="button"
              onClick={confirmPin}
              style={{
                padding: "9px 16px", borderRadius: 10, border: "none", background: T.primary,
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {L.confirm}
            </button>
            <button
              type="button"
              onClick={() => setPinAction(null)}
              style={{
                padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff",
                color: T.inkSoft, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {L.cancel}
            </button>
          </div>
          {pinError && <p style={{ color: T.danger, fontSize: 13, fontWeight: 600, margin: "8px 0 0" }}>{pinError}</p>}
        </div>
      )}
    </div>
  );
}

// ---------- Hero banner photos ----------
// Paste licensed photo URLs here (e.g. from pexels.com — free for commercial use).
// When empty, the banner shows the brand illustration instead.
const HERO_PHOTOS = [
  // Free Pexels photos (Pexels license: free for commercial use, no attribution required)
  // Aide assisting an elderly woman with a walker:
  "https://images.pexels.com/photos/34328480/pexels-photo-34328480.jpeg?auto=compress&cs=tinysrgb&h=400",
  // Aide with a senior adult in a wheelchair:
  "https://images.pexels.com/photos/16364306/pexels-photo-16364306.jpeg?auto=compress&cs=tinysrgb&h=400",
  // Caregiver with an infant (chosen by Jason — Pexels, free license):
  "https://images.pexels.com/photos/23174628/pexels-photo-23174628.jpeg?auto=compress&cs=tinysrgb&h=400",
];

function HeroVisual() {
  const [failed, setFailed] = useState({});
  const photos = HERO_PHOTOS.filter((_, i) => !failed[i]);
  if (photos.length === 0) return <HeroIllustration />;
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {HERO_PHOTOS.slice(0, 3).map((url, i) =>
        failed[i] ? null : (
          <img
            key={url}
            src={url}
            alt="A home aide caring for a senior"
            onError={() => setFailed((f) => ({ ...f, [i]: true }))}
            style={{
              flex: 1, minWidth: 0, height: 150, objectFit: "cover",
              borderRadius: 10, display: "block",
            }}
          />
        )
      )}
    </div>
  );
}

// ---------- Hero illustration ----------
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 640 210"
      role="img"
      aria-label="Home aides assisting seniors and people with disabilities in daily life"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* ground */}
      <ellipse cx="320" cy="216" rx="330" ry="44" fill="#E4EDE6" />
      {/* sun */}
      <circle cx="596" cy="38" r="18" fill="#E8A83E" opacity="0.85" />
      {/* pine tree */}
      <rect x="52" y="128" width="10" height="44" rx="3" fill="#7A5A3A" />
      <polygon points="57,40 92,102 22,102" fill="#2E6E5E" />
      <polygon points="57,68 98,134 16,134" fill="#3B8271" />
      {/* red-crowned crane flying */}
      <g>
        <ellipse cx="178" cy="60" rx="16" ry="8" fill="#FFFFFF" stroke="#B9CEC6" strokeWidth="1.5" />
        <path d="M186 55 q6 -24 32 -28 q-10 16 -16 30 z" fill="#22403A" />
        <path d="M168 58 C158 48 150 44 142 47" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="141" cy="46" r="5" fill="#FFFFFF" stroke="#B9CEC6" strokeWidth="1.2" />
        <circle cx="140" cy="42.5" r="1.8" fill="#C0392B" />
        <path d="M136 46 l-11 3 l11 2 z" fill="#E8A83E" />
        <line x1="192" y1="64" x2="212" y2="72" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* heart */}
      <path d="M356 46 c4 -8 16 -6 16 3 c0 7 -9 12 -16 17 c-7 -5 -16 -10 -16 -17 c0 -9 12 -11 16 -3 z" fill="#E8A83E" opacity="0.9" />

      {/* scene 1: aide steadying an elder who walks with a cane */}
      <g>
        {/* elder */}
        <circle cx="268" cy="84" r="13" fill="#E8B48A" />
        <path d="M255 82 a13 13 0 0 1 26 -3 l-5 -7 q-9 -7 -17 1 z" fill="#DCDCDC" />
        <path d="M252 152 q-2 -46 16 -52 q16 -4 20 10 q6 26 2 42 z" fill="#B9A7C9" />
        <line x1="246" y1="120" x2="240" y2="176" stroke="#8A6B4A" strokeWidth="4" strokeLinecap="round" />
        <circle cx="247" cy="117" r="4.5" fill="#E8B48A" />
        <rect x="258" y="148" width="8" height="28" rx="4" fill="#6E6E7E" />
        <rect x="272" y="148" width="8" height="28" rx="4" fill="#6E6E7E" />
        {/* aide in scrubs, arm around elder's back */}
        <circle cx="308" cy="68" r="13" fill="#C68863" />
        <path d="M295 64 a13 13 0 0 1 26 0 l0 -6 q-13 -10 -26 0 z" fill="#2B2B2B" />
        <path d="M295 150 q-4 -50 13 -56 q17 -6 21 8 q8 30 4 48 z" fill="#2E6E5E" />
        <path d="M299 100 q-18 6 -27 16" stroke="#2E6E5E" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="271" cy="118" r="4.5" fill="#C68863" />
        <rect x="299" y="146" width="9" height="30" rx="4" fill="#22403A" />
        <rect x="313" y="146" width="9" height="30" rx="4" fill="#22403A" />
      </g>

      {/* scene 2: aide assisting a senior in a wheelchair */}
      <g>
        {/* aide pushing */}
        <circle cx="438" cy="70" r="13" fill="#8A5A3A" />
        <path d="M425 66 a13 13 0 0 1 26 0 l0 -6 q-13 -10 -26 0 z" fill="#1E1E1E" />
        <path d="M426 150 q-6 -52 12 -58 q16 -5 20 9 q7 28 3 49 z" fill="#3B8271" />
        <path d="M446 96 q14 6 21 12" stroke="#3B8271" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="469" cy="110" r="4.5" fill="#8A5A3A" />
        <rect x="430" y="146" width="9" height="32" rx="4" fill="#22403A" />
        <rect x="444" y="146" width="9" height="32" rx="4" fill="#22403A" />
        {/* wheelchair frame */}
        <path d="M470 130 l0 -24 l-6 -3" stroke="#3A3A3A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M470 130 l42 0 q9 0 11 9 l5 21" stroke="#3A3A3A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="488" cy="156" r="26" fill="none" stroke="#3A3A3A" strokeWidth="5" />
        <circle cx="488" cy="156" r="4" fill="#3A3A3A" />
        <line x1="488" y1="156" x2="488" y2="134" stroke="#3A3A3A" strokeWidth="2.5" />
        <line x1="488" y1="156" x2="506" y2="146" stroke="#3A3A3A" strokeWidth="2.5" />
        <line x1="488" y1="156" x2="470" y2="144" stroke="#3A3A3A" strokeWidth="2.5" />
        <circle cx="527" cy="172" r="9" fill="none" stroke="#3A3A3A" strokeWidth="4" />
        {/* senior seated */}
        <circle cx="494" cy="92" r="12" fill="#E8B48A" />
        <path d="M482 88 a12 12 0 0 1 24 0 l0 -5 q-12 -9 -24 0 z" fill="#EDEDED" />
        <path d="M480 136 q0 -32 14 -34 q14 -2 16 12 l2 22 z" fill="#D98E5A" />
        <path d="M482 130 q22 -4 28 6 l4 16 q-2 6 -8 4 l-5 -14 q-10 -4 -19 -2 z" fill="#6E6E7E" />
      </g>
    </svg>
  );
}

// ---------- Care requests (client job postings) ----------
function JobForm({ onSaved, onCancel, initial }) {
  const { L, ts } = useLang();
  const [payStep, setPayStep] = useState(false);
  const [form, setForm] = useState(
    initial || {
      title: "", name: "", phone: "", email: "", city: "", zip: "",
      schedule: "", rate: "", services: [], details: "", pin: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (item) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(item) ? f.services.filter((x) => x !== item) : [...f.services, item],
    }));

  async function save() {
    if (!form.title.trim() || !form.name.trim() || !form.phone.trim() || !form.city.trim()) {
      setError(L.errJobReq);
      return;
    }
    if (!/^\d{4}$/.test(form.pin || "")) {
      setError(L.errPin);
      return;
    }
    if (!initial && !payStep) {
      setPayStep(true);
      setError("");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const row = jobToDb(form);
      const saved = initial?.id
        ? await sbUpdate("care_requests", initial.id, row)
        : await sbInsert("care_requests", row);
      onSaved(jobFromDb(saved));
    } catch (e) {
      setError(L.errSave);
      setSaving(false);
    }
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {initial ? L.jfUpd : L.jfTitle}
      </h2>
      <p style={{ margin: "0 0 20px", color: T.inkSoft, fontSize: 15 }}>
        {L.jfSub}
      </p>

      <Field label={L.lTitle} required>
        <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Weekday morning help for my mother" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={L.lYourName} required>
          <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="First name is fine" />
        </Field>
        <Field label={L.lPhone} required>
          <input style={inputStyle} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 555-1234" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Field label={L.lEmail}>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Optional" />
        </Field>
        <Field label={L.lCity} required>
          <input style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Flushing, NY" />
        </Field>
        <Field label={L.lZip}>
          <input style={inputStyle} inputMode="numeric" value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="11354" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <Field label={L.lSchedule}>
          <input style={inputStyle} value={form.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="e.g. Mon–Fri, 8am–12pm" />
        </Field>
        <Field label={L.lOffered}>
          <input style={inputStyle} inputMode="numeric" value={form.rate} onChange={(e) => set("rate", e.target.value)} placeholder="25" />
        </Field>
      </div>

      <Field label={L.lServicesNeeded}>
        {SERVICE_GROUPS.map(([gk, items]) => (
          <div key={gk} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.inkSoft, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>{L[gk]}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items.map((s) => (
                <Chip key={s} label={ts(s)} active={form.services.includes(s)} onClick={() => toggle(s)} />
              ))}
            </div>
          </div>
        ))}
      </Field>

      <Field label={L.lDetails}>
        <textarea
          style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
          value={form.details}
          onChange={(e) => set("details", e.target.value)}
          placeholder={L.detailsPh}
        />
      </Field>

      <Field label={L.lPinJob} required>
        <input
          style={{ ...inputStyle, maxWidth: 160, letterSpacing: 4 }}
          inputMode="numeric"
          maxLength={4}
          value={form.pin || ""}
          onChange={(e) => set("pin", e.target.value.replace(/\D/g, ""))}
          placeholder="••••"
        />
      </Field>

      {payStep && !initial && (
        <div style={{ border: `2px solid ${T.amber}`, borderRadius: 14, padding: 14, marginBottom: 14, background: "#FFFDF7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 15.5, fontWeight: 800, color: T.ink }}>{L.postFeeTitle}</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: T.primary }}>$9.99</span>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: T.inkSoft, lineHeight: 1.5 }}>{L.postFeeNote}</p>
        </div>
      )}
      {error && <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none",
            background: saving ? T.inkSoft : T.primary, color: "#fff",
            fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {saving ? L.saving : initial ? L.save : payStep ? L.payPublish : L.publishJob}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${T.line}`,
            background: "#fff", color: T.ink, fontSize: 16, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {L.cancel}
        </button>
      </div>
      <p style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 12, marginBottom: 0 }}>
        {L.jobShared}
      </p>
    </div>
  );
}

function JobCard({ job, onDelete, onEdit, aidePro, onAideProSignup }) {
  const { L, ts } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [pinAction, setPinAction] = useState(null);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");

  function requestAction(action) {
    if (!job.pin) {
      action === "edit" ? onEdit(job) : onDelete(job);
      return;
    }
    setPinAction(action);
    setPinValue("");
    setPinError("");
  }
  function confirmPin() {
    if (pinValue === job.pin) {
      const action = pinAction;
      setPinAction(null);
      action === "edit" ? onEdit(job) : onDelete(job);
    } else {
      setPinError(L.pinBad);
    }
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, border: `1px solid ${T.line}`, padding: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: T.ink }}>{job.title}</div>
        {job.rate && <div style={{ fontWeight: 800, color: T.primary, whiteSpace: "nowrap" }}>${job.rate}/hr</div>}
      </div>
      <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 2 }}>
        {job.city}{job.schedule ? ` · ${job.schedule}` : ""} · {L.postedOn} {new Date(job.createdAt).toLocaleDateString()}
      </div>
      {job.services?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {job.services.map((s) => (
            <span key={s} style={{ fontSize: 12.5, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: T.surface, color: T.ink, border: `1px solid ${T.line}` }}>
              {ts(s)}
            </span>
          ))}
        </div>
      )}
      {expanded && (
        <div style={{ marginTop: 12, fontSize: 14.5, color: T.ink }}>
          {job.details && <p style={{ margin: "0 0 8px", color: T.inkSoft }}>{job.details}</p>}
          {aidePro ? (
            <p style={{ margin: 0 }}>
              <strong>{L.contactPerson} {job.name}:</strong>{" "}
              <a href={"tel:" + job.phone} style={{ color: T.primary, fontWeight: 700 }}>{job.phone}</a>
              {job.email ? <> · <a href={"mailto:" + job.email} style={{ color: T.primary }}>{job.email}</a></> : null}
            </p>
          ) : (
            <div style={{ padding: 12, background: T.surface, borderRadius: 10, border: `1px dashed ${T.line}` }}>
              <p style={{ margin: "0 0 8px", fontSize: 14, color: T.ink }}>
                🔒 <strong>{L.contactPerson} {job.name}: (•••) •••-••••</strong> — {L.aideProLocked}
              </p>
              <button
                type="button"
                onClick={onAideProSignup}
                style={{
                  padding: "10px 16px", borderRadius: 10, border: "none", background: T.primary,
                  color: "#fff", fontWeight: 800, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {L.aideProBtn}
              </button>
            </div>
          )}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{
            flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${T.primary}`,
            background: expanded ? T.primary : "#fff", color: expanded ? "#fff" : T.primary,
            fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {expanded ? L.showLess : L.viewDetails}
        </button>
        <button type="button" onClick={() => requestAction("edit")} title="Edit post (owner only)"
          style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          {L.editBtn}
        </button>
        <button type="button" onClick={() => requestAction("delete")} title="Remove post (owner only)"
          style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          ✕
        </button>
      </div>
      {pinAction && (
        <div style={{ marginTop: 10, padding: 12, background: T.surface, borderRadius: 10, border: `1px solid ${T.line}` }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: T.ink, marginBottom: 6 }}>
            {L.pinPrompt}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...inputStyle, maxWidth: 120, letterSpacing: 4, padding: "9px 12px" }}
              inputMode="numeric" maxLength={4} value={pinValue}
              onChange={(e) => { setPinValue(e.target.value.replace(/\D/g, "")); setPinError(""); }}
              placeholder="••••"
            />
            <button type="button" onClick={confirmPin}
              style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: T.primary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              {L.confirm}
            </button>
            <button type="button" onClick={() => setPinAction(null)}
              style={{ padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              {L.cancel}
            </button>
          </div>
          {pinError && <p style={{ color: T.danger, fontSize: 13, fontWeight: 600, margin: "8px 0 0" }}>{pinError}</p>}
        </div>
      )}
    </div>
  );
}

// ---------- Subscription plans ----------
const PLANS = [
  { id: "monthly", name: "Monthly", price: "$19.99", per: "/month", months: 1, blurb: "Full access, cancel anytime." },
  { id: "quarterly", name: "3 Months", price: "$49.99", per: "/3 months", months: 3, blurb: "Save 17% — most popular.", featured: true },
  { id: "annual", name: "Annual", price: "$149.99", per: "/year", months: 12, blurb: "Best value — save 37%." },
];

function PlansView({ onActivate, onBack, singleUnlock, onSingleUnlock }) {
  const { L } = useLang();
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16, padding: "8px 14px", borderRadius: 999,
          border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {L.back}
      </button>
      <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {L.plTitle}
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 15, color: T.inkSoft, lineHeight: 1.5 }}>
        {L.plSub}
      </p>

      <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.line}`, padding: "12px 16px", marginBottom: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, color: T.ink, marginBottom: 6 }}>{L.benefitsTitle}</div>
        {[L.benefit1, L.benefit2, L.benefit3, L.benefit4].map((b) => (
          <div key={b} style={{ fontSize: 14, color: T.inkSoft, marginBottom: 4 }}>✓ {b}</div>
        ))}
      </div>

      {singleUnlock && (
        <div style={{ border: `2px solid ${T.amber}`, borderRadius: 14, padding: 16, marginBottom: 14, background: "#FFFDF7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: T.ink }}>{L.suName}</span>
            <span>
              <span style={{ fontSize: 20, fontWeight: 800, color: T.primary }}>{L.suPrice}</span>
              <span style={{ fontSize: 13, color: T.inkSoft }}>{L.suPer}</span>
            </span>
          </div>
          <div style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4, marginBottom: 10 }}>{L.suBlurb}</div>
          <button
            type="button"
            onClick={onSingleUnlock}
            style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: T.amber, color: "#3A2A08", fontWeight: 800, fontSize: 15.5, cursor: "pointer", fontFamily: "inherit" }}
          >
            {L.suName} ✓
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p)}
            style={{
              textAlign: "left", padding: "16px", borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
              border: `2px solid ${selected?.id === p.id ? T.primary : p.featured ? T.amber : T.line}`,
              background: selected?.id === p.id ? "#EFF6F3" : "#fff",
              position: "relative",
            }}
          >
            {p.featured && (
              <span style={{ position: "absolute", top: -10, right: 14, background: T.amber, color: "#3A2A08", fontSize: 11.5, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>
                {L.popular}
              </span>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: T.ink }}>{L["plan_" + p.id]}</span>
              <span>
                <span style={{ fontSize: 20, fontWeight: 800, color: T.primary }}>{p.price}</span>
                <span style={{ fontSize: 13, color: T.inkSoft }}>{p.per}</span>
              </span>
            </div>
            <div style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4 }}>{L["blurb_" + p.id]}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 18, padding: 16, background: T.surface, borderRadius: 14, border: `1px solid ${T.line}` }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
            {L["plan_" + selected.id]} — {selected.price}{selected.per}
          </div>
          <p style={{ fontSize: 13.5, color: T.inkSoft, margin: "0 0 12px", lineHeight: 1.5 }}>
            {L.demoText}
          </p>
          <button
            type="button"
            onClick={() => onActivate(selected)}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: T.primary, color: "#fff", fontSize: 16.5, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {L.activate}
          </button>
        </div>
      )}
    </div>
  );
}


// ---------- FAQ content (EN / 中文 / Español) ----------
const FAQ = {
  en: {
    client: [
      ["Is browsing free?", "Yes. Anyone can search and browse every verified caregiver profile for free. A membership unlocks full profiles and direct contact information (phone and email) for every caregiver on the platform."],
      ["Why keep my membership after I've hired someone?", "Because care needs change. Active members get replacement matching at no extra charge if your caregiver becomes unavailable — illness, schedule changes, or moving on. You can also post urgent backup requests and contact unlimited caregivers as needs evolve, whether that's more hours, respite relief, or recovery care after a hospital stay. Your membership is your safety net, not just a one-time search."],
      ["Are caregivers verified?", "Every caregiver listed has been reviewed by Kajing Care before appearing in the directory — that's what the ✓ Verified badge means. We still encourage families to interview candidates and check references; our platform gives you the tools and reviews to do it well."],
      ["Who sets the pay rate?", "You and the caregiver agree on the rate directly. There is no agency markup in the middle — caregivers typically earn more than agency wages while families often pay less than agency billing rates."],
      ["I live out of state or overseas — can I arrange care for my parents?", "Absolutely — this is one of the things Kajing Care was built for. Search by the ZIP code where your loved one lives, review verified profiles in English, 中文, or Español, and contact caregivers from anywhere in the world."],
      ["What if the caregiver doesn't work out?", "With an active membership, just come back — contact new caregivers or post a care request at no additional charge. Members never start from zero. This ongoing protection is the biggest reason families keep their membership active."],
    ],
    aide: [
      ["Does it cost money to join as a caregiver?", "No. Creating your profile is free, and it stays free to be listed once verified."],
      ["How do I get clients?", "Two ways: families searching your area find your verified profile, and you can browse the Care Requests board and contact families directly about the jobs they've posted."],
      ["Why keep my profile active after I find work?", "Because every job ends eventually — schedules change, families relocate, care needs shift. An active profile with good reviews means your next client finds you before your current job ends, so you avoid gaps in income. Think of your profile as your ongoing storefront, not a one-time ad."],
      ["How do reviews help me earn more?", "Caregivers with strong reviews get contacted first and can confidently ask for higher rates. Every family you serve well builds a reputation that lives permanently on your profile — it's the most valuable asset you build here."],
      ["Do I keep all my earnings?", "Yes. Families pay you directly at the rate you agreed. Kajing Care never takes a cut of your hourly pay."],
      ["What does the Verified badge mean for me?", "Verification tells families your identity and stated credentials have been reviewed — verified caregivers get significantly more contact from families. Keep your certifications up to date on your profile to make the most of it."],
    ],
  },
  zh: {
    client: [
      ["瀏覽是免費的嗎？", "是的。任何人都可以免費搜尋及瀏覽所有經驗證的照護者檔案。成為會員後，即可解鎖完整檔案與每位照護者的直接聯絡方式（電話與電子郵件）。"],
      ["已經請到人了，為什麼還要續會員？", "因為照護需求會變化。會員在照護者因生病、時間衝突或離職而無法繼續時，可免費重新配對。您也可以發布緊急替補需求，並隨需求變化（增加時數、喘息照護、術後照護）聯繫任何照護者。會員資格是您的安全網，不只是一次性的搜尋。"],
      ["照護者有經過驗證嗎？", "名錄中的每位照護者都經過家政通審核後才會顯示 — 這就是 ✓ 已驗證標章的意義。我們仍建議家庭親自面談並查核推薦人；平台提供評價與工具協助您做好把關。"],
      ["時薪由誰決定？", "由您與照護者直接商定，中間沒有仲介抽成 — 照護者通常比仲介工資賺得多，而家庭往往比仲介收費付得少。"],
      ["我住在外州或海外，可以為父母安排照護嗎？", "當然可以 — 這正是家政通的核心服務之一。輸入家人居住地的郵遞區號搜尋，以中文、英文或西班牙文瀏覽經驗證的檔案，從世界任何地方聯繫照護者。"],
      ["如果照護者不合適怎麼辦？", "只要會員資格有效，隨時回來即可 — 免費聯繫新的照護者或發布徵求。會員永遠不必從零開始，這份持續保障正是家庭續會的最大原因。"],
    ],
    aide: [
      ["註冊成為照護者要收費嗎？", "不用。建立檔案完全免費，通過驗證後刊登也免費。"],
      ["我要怎麼找到客戶？", "兩個管道：您所在地區的家庭搜尋時會看到您的驗證檔案；您也可以瀏覽「徵求看護」版面，直接聯繫發布需求的家庭。"],
      ["找到工作後，為什麼還要保持檔案有效？", "因為每份工作終會結束 — 時間表變動、家庭搬遷、照護需求改變。保持檔案活躍並累積好評，下一位客戶會在目前工作結束前找到您，避免收入中斷。把檔案當作您長期經營的店面，而不是一次性的廣告。"],
      ["評價如何幫助我賺更多？", "評價優良的照護者會最先被聯繫，也能有底氣開出較高時薪。每服務好一個家庭，都會在您的檔案上累積永久的口碑 — 這是您在平台上最有價值的資產。"],
      ["我的收入需要被抽成嗎？", "不需要。家庭依雙方議定的時薪直接付款給您，家政通不從您的時薪中抽取任何費用。"],
      ["「已驗證」標章對我有什麼意義？", "驗證代表您的身分與所列資格已經過審核 — 通過驗證的照護者獲得家庭聯繫的機會顯著更多。請保持檔案上的證照資訊最新，發揮最大效益。"],
    ],
  },
  es: {
    client: [
      ["¿Navegar es gratis?", "Sí. Cualquiera puede buscar y ver todos los perfiles verificados gratis. La membresía desbloquea los perfiles completos y la información de contacto directa (teléfono y correo) de cada cuidador."],
      ["¿Por qué mantener mi membresía después de contratar?", "Porque las necesidades de cuidado cambian. Los miembros activos obtienen un nuevo emparejamiento sin costo adicional si su cuidador deja de estar disponible. También puede publicar solicitudes urgentes de reemplazo y contactar cuidadores ilimitados a medida que cambian las necesidades. Su membresía es su red de seguridad, no solo una búsqueda única."],
      ["¿Los cuidadores están verificados?", "Cada cuidador listado fue revisado por Kajing Care antes de aparecer — eso significa la insignia ✓ Verificado. Aun así recomendamos entrevistar y pedir referencias; la plataforma le da las herramientas y reseñas para hacerlo bien."],
      ["¿Quién establece la tarifa?", "Usted y el cuidador la acuerdan directamente. No hay margen de agencia — los cuidadores suelen ganar más y las familias suelen pagar menos que con una agencia."],
      ["Vivo en otro estado o país — ¿puedo organizar el cuidado de mis padres?", "Por supuesto — la plataforma fue creada para eso. Busque por el código postal donde vive su ser querido, revise perfiles verificados en español, inglés o chino, y contacte cuidadores desde cualquier parte del mundo."],
      ["¿Y si el cuidador no funciona?", "Con membresía activa, simplemente regrese — contacte nuevos cuidadores o publique una solicitud sin cargo adicional. Los miembros nunca empiezan de cero. Esta protección continua es la mayor razón para mantener la membresía."],
    ],
    aide: [
      ["¿Cuesta dinero registrarse como cuidador?", "No. Crear su perfil es gratis, y estar listado tras la verificación también."],
      ["¿Cómo consigo clientes?", "De dos formas: las familias de su zona encuentran su perfil verificado al buscar, y usted puede revisar las Solicitudes y contactar directamente a las familias."],
      ["¿Por qué mantener mi perfil activo después de encontrar trabajo?", "Porque todo trabajo termina — cambian los horarios, las familias se mudan, las necesidades evolucionan. Un perfil activo con buenas reseñas significa que su próximo cliente lo encuentra antes de que termine el actual, evitando periodos sin ingresos."],
      ["¿Cómo me ayudan las reseñas a ganar más?", "Los cuidadores con buenas reseñas son contactados primero y pueden pedir tarifas más altas. Cada familia bien atendida construye una reputación permanente en su perfil — su activo más valioso aquí."],
      ["¿Me quedo con todo lo que gano?", "Sí. Las familias le pagan directamente la tarifa acordada. Kajing Care nunca toma un porcentaje de su pago por hora."],
      ["¿Qué significa la insignia Verificado para mí?", "La verificación indica que su identidad y credenciales fueron revisadas — los cuidadores verificados reciben mucho más contacto de las familias. Mantenga sus certificaciones al día para aprovecharla al máximo."],
    ],
  },
};

function FaqView({ onBack }) {
  const { lang, L } = useLang();
  const faq = FAQ[lang] || FAQ.en;
  const section = (title, items) => (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 19, color: T.primary, fontFamily: "Georgia, 'Times New Roman', serif" }}>{title}</h3>
      {items.map(([q, a]) => (
        <details key={q} style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.line}`, padding: "12px 14px", marginBottom: 8 }}>
          <summary style={{ fontWeight: 700, fontSize: 15, color: T.ink, cursor: "pointer" }}>{q}</summary>
          <p style={{ margin: "10px 0 0", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.6 }}>{a}</p>
        </details>
      ))}
    </div>
  );
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16, padding: "8px 14px", borderRadius: 999,
          border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {L.back}
      </button>
      <h2 style={{ margin: "0 0 16px", fontSize: 26, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {L.faqTitle}
      </h2>
      {section(L.faqClientTitle, faq.client)}
      {section(L.faqAideTitle, faq.aide)}
    </div>
  );
}

// ---------- Member sign up / sign in ----------
function AuthView({ onDone, onBack }) {
  const { L } = useLang();
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function go() {
    if (!email.trim() || password.length < 6 || (mode === "signup" && !name.trim())) {
      setErr(L.authErr);
      return;
    }
    setBusy(true);
    setErr("");
    try {
      let user = null;
      let token = null;
      if (mode === "signup") {
        const d = await authSignup(email.trim(), password, name.trim());
        user = d.user || d;
        token = d.access_token || (d.session && d.session.access_token) || null;
        if (!token) {
          try {
            const l = await authLogin(email.trim(), password);
            user = l.user;
            token = l.access_token;
          } catch (e2) {
            setErr(L.authConfirm);
            setMode("login");
            setBusy(false);
            return;
          }
        }
      } else {
        const d = await authLogin(email.trim(), password);
        user = d.user;
        token = d.access_token;
      }
      const acct = { id: user.id, email: user.email, name: (user.user_metadata && user.user_metadata.name) || name.trim() || "" };
      try { localStorage.setItem("pcc_session", JSON.stringify({ user: acct, access_token: token })); } catch (e) { /* ignore */ }
      onDone(acct);
    } catch (e) {
      setErr(L.authErr);
    }
    setBusy(false);
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}`, maxWidth: 420 }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {L.authTitle}
      </h2>
      <p style={{ margin: "0 0 16px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>{L.authSub}</p>
      {mode === "signup" && (
        <Field label={L.lName} required>
          <input style={inputStyle} value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} />
        </Field>
      )}
      <Field label={L.lEmailAddr} required>
        <input style={inputStyle} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="you@email.com" />
      </Field>
      <Field label={L.lPassword} required>
        <input style={inputStyle} type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErr(""); }} placeholder="••••••" />
      </Field>
      {err && <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{err}</p>}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button
          type="button"
          onClick={go}
          disabled={busy}
          style={{ flex: 1, padding: "13px", borderRadius: 12, border: "none", background: busy ? T.inkSoft : T.primary, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
        >
          {busy ? L.saving : mode === "signup" ? L.signUp : L.signIn}
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          {L.cancel}
        </button>
      </div>
      <button
        type="button"
        onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErr(""); }}
        style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: 0, textDecoration: "underline" }}
      >
        {mode === "signup" ? L.authToLogin : L.authToSignup}
      </button>
    </div>
  );
}

// ---------- Phone Sign In (v3.4) — PIN-based, one flow for all roles ----------
function PhoneAuthView({ onDone, onBack }) {
  const { L } = useLang();
  // Steps: "phone" -> "signin" (returning) or "signup" (new)
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const isOtpMode = PHONE_AUTH_MODE === "otp";

  async function handleContinue() {
    if ((phone.replace(/\D/g, "").length) < 10) {
      setErr(L.phoneAuthPhoneBad);
      return;
    }
    setBusy(true); setErr("");
    try {
      if (isOtpMode) {
        await sendPhoneOtp(phone);
        setStep("otp");
      } else {
        const exists = await checkPhoneRegistered(phone);
        setStep(exists ? "signin" : "signup");
      }
    } catch (e) {
      setErr(isOtpMode ? L.phoneAuthSendErr : L.phoneAuthPhoneBad);
    }
    setBusy(false);
  }

  async function handleSignin() {
    if (pin.length !== PIN_LENGTH) { setErr(L.phoneAuthPinLen); return; }
    setBusy(true); setErr("");
    try {
      const acct = await signinWithPin(phone, pin);
      const sess = { user: acct, kind: "pin" };
      try { localStorage.setItem("pcc_session", JSON.stringify(sess)); } catch (_) {}
      onDone(acct);
    } catch (e) {
      setErr(L.phoneAuthWrongPin);
      setPin("");
    }
    setBusy(false);
  }

  async function handleSignup() {
    if (!name.trim()) { setErr(L.authErr); return; }
    if (pin.length !== PIN_LENGTH) { setErr(L.phoneAuthPinLen); return; }
    if (pin !== pin2) { setErr(L.phoneAuthPinMismatch); return; }
    setBusy(true); setErr("");
    try {
      const acct = await signupWithPin(phone, pin, name.trim(), role);
      const sess = { user: acct, kind: "pin" };
      try { localStorage.setItem("pcc_session", JSON.stringify(sess)); } catch (_) {}
      onDone(acct);
    } catch (e) {
      setErr(e.message || L.authErr);
    }
    setBusy(false);
  }

  const card = { background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}`, maxWidth: 420 };
  const primary = { padding: "13px", borderRadius: 12, border: "none", background: busy ? T.inkSoft : T.primary, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
  const secondary = { padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
  const pinInputStyle = { ...inputStyle, letterSpacing: 8, fontSize: 22, textAlign: "center", fontWeight: 700 };

  if (step === "phone") {
    return (
      <div style={card}>
        <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>{L.signInBtn}</h2>
        <p style={{ margin: "0 0 16px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>
          {isOtpMode ? L.phoneAuthSub : "Enter your phone number to sign in or create an account."}
        </p>
        <Field label={L.lPhoneNumber} required>
          <input style={inputStyle} type="tel" value={phone}
            onChange={(e) => { setPhone(e.target.value); setErr(""); }}
            placeholder="(415) 555-1234" autoFocus />
        </Field>
        {err && <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{err}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button type="button" onClick={handleContinue} disabled={busy} style={{ ...primary, flex: 1 }}>
            {busy ? L.saving : L.phoneAuthContinue}
          </button>
          <button type="button" onClick={onBack} style={secondary}>{L.cancel}</button>
        </div>
      </div>
    );
  }

  if (step === "signin") {
    return (
      <div style={card}>
        <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
          {L.phoneAuthReturning}
        </h2>
        <p style={{ margin: "0 0 16px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>
          <strong>{toE164(phone)}</strong>
        </p>
        <Field label={L.lEnterPin} required>
          <input style={pinInputStyle} type="tel" inputMode="numeric" maxLength={PIN_LENGTH}
            value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }}
            placeholder={"\u2022".repeat(PIN_LENGTH)} autoFocus />
        </Field>
        {err && <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{err}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button type="button" onClick={handleSignin} disabled={busy} style={{ ...primary, flex: 1 }}>
            {busy ? L.saving : L.signInBtn}
          </button>
          <button type="button" onClick={() => { setStep("phone"); setPin(""); setErr(""); }} style={secondary}>
            {L.cancel}
          </button>
        </div>
      </div>
    );
  }

  const roleOptions = [
    ["member", L.roleMember],
    ["aide",   L.roleAide],
    ["agency", L.roleAgency],
  ];
  return (
    <div style={card}>
      <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {L.phoneAuthNewUser}
      </h2>
      <p style={{ margin: "0 0 16px", fontSize: 14.5, color: T.inkSoft }}>
        <strong>{toE164(phone)}</strong>
      </p>
      <Field label={L.lName} required>
        <input style={inputStyle} value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} autoFocus />
      </Field>
      <Field label={L.lSetPin} required>
        <input style={pinInputStyle} type="tel" inputMode="numeric" maxLength={PIN_LENGTH}
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }}
          placeholder={"\u2022".repeat(PIN_LENGTH)} />
      </Field>
      <Field label={L.lConfirmPin} required>
        <input style={pinInputStyle} type="tel" inputMode="numeric" maxLength={PIN_LENGTH}
          value={pin2}
          onChange={(e) => { setPin2(e.target.value.replace(/\D/g, "")); setErr(""); }}
          placeholder={"\u2022".repeat(PIN_LENGTH)} />
      </Field>
      <Field label={L.phoneAuthRolePrompt} required>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {roleOptions.map(([id, label]) => (
            <button key={id} type="button" onClick={() => setRole(id)}
              style={{
                padding: "12px 14px", borderRadius: 10, textAlign: "left",
                border: `2px solid ${role === id ? T.primary : T.line}`,
                background: role === id ? "#EFF6F3" : "#fff",
                color: T.ink, fontSize: 15, fontWeight: role === id ? 700 : 500,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              {role === id ? "\u25CF " : "\u25CB "}{label}
            </button>
          ))}
        </div>
      </Field>
      {err && <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{err}</p>}
      <button type="button" onClick={handleSignup} disabled={busy} style={{ ...primary, width: "100%" }}>
        {busy ? L.saving : L.phoneAuthFinish}
      </button>
    </div>
  );
}

// ---------- Agency dashboard (v3.6) — leaderboard + demand report ----------
function AgencyDashboardView({ account, subscribed, onUpgrade, onBack }) {
  const { L } = useLang();
  const [aides, setAides] = useState([]);
  const [demand, setDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Free tier sees top 5 aides + top 3 ZIPs; paid tier sees full 20/20
      const aideLimit = subscribed ? 20 : 5;
      const demandLimit = subscribed ? 20 : 3;
      const [a, d] = await Promise.all([
        fetchAideLeaderboard(aideLimit, 30),
        fetchSearchDemand(demandLimit, 30),
      ]);
      setAides(a);
      setDemand(d);
      setLoading(false);
    })();
  }, [subscribed]);

  const card = { background: "#fff", borderRadius: 14, border: `1px solid ${T.line}`, padding: 20, marginBottom: 16 };
  const th = { textAlign: "left", padding: "10px 8px", fontSize: 13, fontWeight: 700, color: T.inkSoft, borderBottom: `1px solid ${T.line}`, textTransform: "uppercase", letterSpacing: 0.4 };
  const td = { padding: "12px 8px", fontSize: 14.5, color: T.ink, borderBottom: `1px solid ${T.line}` };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <button type="button" onClick={onBack}
        style={{ padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginBottom: 14 }}>
        ← Back
      </button>

      <h1 style={{ margin: "0 0 6px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 28, color: T.ink }}>
        {L.agencyDashTitle}
      </h1>
      <p style={{ margin: "0 0 20px", fontSize: 15, color: T.inkSoft, lineHeight: 1.5 }}>{L.agencyDashSub}</p>

      {/* Hot aides */}
      <div style={card}>
        <h2 style={{ margin: "0 0 4px", fontSize: 19, color: T.ink, fontFamily: "Georgia, serif" }}>{L.hotAides}</h2>
        <p style={{ margin: "0 0 14px", fontSize: 13.5, color: T.inkSoft }}>{L.hotAidesSub}</p>
        {loading ? (
          <p style={{ fontSize: 14, color: T.inkSoft, padding: "12px 0" }}>Loading…</p>
        ) : aides.length === 0 ? (
          <p style={{ fontSize: 14, color: T.inkSoft, padding: "12px 0" }}>{L.reportEmpty}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ ...th, width: 40 }}>{L.tblRank}</th>
                  <th style={th}>{L.tblAide}</th>
                  <th style={th}>{L.tblLocation}</th>
                  <th style={{ ...th, textAlign: "right" }}>{L.tblViews}</th>
                  <th style={{ ...th, textAlign: "right" }}>{L.tblContacts}</th>
                  <th style={{ ...th, textAlign: "right" }}>{L.tblRate}</th>
                </tr>
              </thead>
              <tbody>
                {aides.map((a) => (
                  <tr key={a.caregiver_id}>
                    <td style={{ ...td, color: T.inkSoft, fontWeight: 700 }}>{a.rank}</td>
                    <td style={{ ...td, fontWeight: 700 }}>{a.caregiver_name || `#${a.caregiver_id}`}</td>
                    <td style={{ ...td, color: T.inkSoft }}>{a.city || "—"}</td>
                    <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{a.views}</td>
                    <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums", color: T.primary, fontWeight: 700 }}>{a.contacts}</td>
                    <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{a.contact_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Search demand */}
      <div style={card}>
        <h2 style={{ margin: "0 0 4px", fontSize: 19, color: T.ink, fontFamily: "Georgia, serif" }}>{L.marketDemand}</h2>
        <p style={{ margin: "0 0 14px", fontSize: 13.5, color: T.inkSoft }}>{L.marketDemandSub}</p>
        {loading ? (
          <p style={{ fontSize: 14, color: T.inkSoft, padding: "12px 0" }}>Loading…</p>
        ) : demand.length === 0 ? (
          <p style={{ fontSize: 14, color: T.inkSoft, padding: "12px 0" }}>{L.reportEmpty}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={th}>{L.tblZip}</th>
                  <th style={{ ...th, textAlign: "right" }}>{L.tblSearches}</th>
                  <th style={{ ...th, textAlign: "right" }}>{L.tblResults}</th>
                </tr>
              </thead>
              <tbody>
                {demand.map((d, i) => (
                  <tr key={i}>
                    <td style={{ ...td, fontWeight: 700 }}>{d.zip_or_city}</td>
                    <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{d.search_count}</td>
                    <td style={{ ...td, textAlign: "right", color: T.inkSoft }}>{d.avg_results}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade CTA for free tier */}
      {!subscribed && (
        <div style={{
          padding: 20, background: "#FFF9E6", border: `2px solid ${T.amber}`, borderRadius: 14,
          marginTop: 8, textAlign: "center",
        }}>
          <p style={{ margin: "0 0 12px", fontSize: 15, color: T.ink, fontWeight: 600 }}>{L.upgradeCta}</p>
          <button type="button" onClick={onUpgrade}
            style={{
              padding: "12px 22px", borderRadius: 10, border: "none",
              background: T.amber, color: "#3A2A08", fontSize: 15, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
            }}>
            {L.upgradeBtn}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Aide self-service profile access ----------
function AideLoginView({ onFound, onBack }) {
  const { L } = useLang();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    setErr("");
    try {
      const digits = (v) => (v || "").replace(/\D/g, "");
      if (!digits(phone) || !/^\d{4}$/.test(pin)) {
        setErr(L.aideLoginErr);
        setBusy(false);
        return;
      }
      const all = await sbSelect("caregivers");
      const rec = all.find((r) => digits(r.phone) === digits(phone) && r.pin === pin);
      if (rec) onFound(aideFromDb({ ...rec }));
      else setErr(L.aideLoginErr);
    } catch (e) {
      setErr(L.errSave);
    }
    setBusy(false);
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}`, maxWidth: 420 }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {L.aideLoginTitle}
      </h2>
      <p style={{ margin: "0 0 16px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>{L.aideLoginSub}</p>
      <Field label={L.lPhone} required>
        <input style={inputStyle} type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setErr(""); }} placeholder="(555) 555-1234" />
      </Field>
      <Field label="PIN" required>
        <input
          style={{ ...inputStyle, maxWidth: 140, letterSpacing: 4 }}
          inputMode="numeric" maxLength={4} value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }}
          placeholder="••••"
        />
      </Field>
      {err && <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{err}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={go}
          disabled={busy}
          style={{ flex: 1, padding: "13px", borderRadius: 12, border: "none", background: busy ? T.inkSoft : T.primary, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
        >
          {busy ? L.saving : L.aideLoginBtn}
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          {L.cancel}
        </button>
      </div>
    </div>
  );
}

// ---------- Admin panel (platform operator only) ----------
const ADMIN_PIN = "8888"; // ← CHANGE THIS to your own passcode before deploying

function AdminView({ onBack, onDataChanged }) {
  const [ok, setOk] = useState(false);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");
  const [tab, setTab] = useState("caregivers");
  const [rows, setRows] = useState([]);
  const [ags, setAgs] = useState([]);
  const [msg, setMsg] = useState("");
  const [agForm, setAgForm] = useState({ name: "", phone: "", website: "", areas: "", blurb: "", contact_name: "", email: "", monthly_fee: "", paid_until: "" });
  const [agEditId, setAgEditId] = useState(null);
  const [dbPing, setDbPing] = useState(null); // null=checking, number=ms, "error"=down
  const [jobsCount, setJobsCount] = useState(0);
  const [revsCount, setRevsCount] = useState(0);
  const [hiresCount, setHiresCount] = useState(0);
  const blankAgForm = { name: "", phone: "", website: "", areas: "", blurb: "", contact_name: "", email: "", monthly_fee: "", paid_until: "" };

  async function refresh() {
    setMsg("");
    try {
      const all = await sbSelect("caregivers");
      all.sort((a, b) => (a.approved === b.approved ? 0 : a.approved ? 1 : -1));
      setRows(all);
    } catch (e) { setMsg("Could not load caregivers."); }
    try { setAgs(await sbSelect("agencies")); } catch (e) { /* table may be empty */ }
    try { setJobsCount((await sbSelect("care_requests")).length); } catch (e) { /* ignore */ }
    try { setRevsCount((await sbSelect("reviews")).length); } catch (e) { /* ignore */ }
    try { setHiresCount((await sbSelect("hires")).length); } catch (e) { /* ignore */ }
  }

  async function ping() {
    setDbPing(null);
    const t0 = performance.now();
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/caregivers?select=id&limit=1`, { headers: sbHeaders });
      if (!r.ok) throw new Error();
      setDbPing(Math.round(performance.now() - t0));
    } catch (e) {
      setDbPing("error");
    }
  }
  useEffect(() => { if (ok) refresh(); }, [ok]);
  useEffect(() => { if (ok && tab === "status") ping(); }, [ok, tab]);

  async function patch(table, id, fields) {
    try { await sbUpdate(table, id, fields); await refresh(); onDataChanged(); }
    catch (e) { setMsg("Update failed — check the agencies policies SQL was run."); }
  }
  async function remove(table, id, label) {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    try { await sbDelete(table, id); await refresh(); onDataChanged(); }
    catch (e) { setMsg("Delete failed."); }
  }
  async function addAgency() {
    if (!agForm.name.trim()) { setMsg("Agency name is required."); return; }
    const payload = {
      ...agForm,
      monthly_fee: agForm.monthly_fee ? Number(agForm.monthly_fee) : null,
      paid_until: agForm.paid_until || null,
    };
    try {
      if (agEditId) {
        await sbUpdate("agencies", agEditId, payload);
        setMsg("Agency updated ✓");
      } else {
        await sbInsert("agencies", { ...payload, active: true });
        setMsg("Agency added ✓");
      }
      setAgForm(blankAgForm);
      setAgEditId(null);
      await refresh();
      onDataChanged();
    } catch (e) {
      console.error("[KJC] addAgency error:", e);
      setMsg("Save failed: " + (e?.message || "unknown error"));
    }
  }

  async function exportAll() {
    setMsg("Exporting…");
    try {
      const grab = async (t) => { try { return await sbSelect(t); } catch (e) { return []; } };
      const data = {
        app: "kajingcare",
        format: 1,
        appVersion: APP_VERSION,
        exportedAt: new Date().toISOString(),
        tables: {
          caregivers: await grab("caregivers"),
          care_requests: await grab("care_requests"),
          reviews: await grab("reviews"),
          agencies: await grab("agencies"),
        },
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kajingcare-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      const t = data.tables;
      setMsg(`Backup downloaded ✓ — ${t.caregivers.length} caregivers, ${t.care_requests.length} care requests, ${t.reviews.length} reviews, ${t.agencies.length} agencies`);
    } catch (e) {
      setMsg("Export failed — check connection.");
    }
  }

  async function importAll(file) {
    setMsg("Restoring…");
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== "kajingcare" || !data.tables) {
        setMsg("That's not a Kajing Care backup file.");
        return;
      }
      const t = data.tables;
      let n = 0;
      n += await sbUpsert("caregivers", t.caregivers);    // first — reviews reference them
      n += await sbUpsert("care_requests", t.care_requests);
      n += await sbUpsert("agencies", t.agencies);
      n += await sbUpsert("reviews", t.reviews);
      setMsg(`Restore complete ✓ — ${n} records re-created or updated.`);
      await refresh();
      onDataChanged();
    } catch (e) {
      setMsg("Restore failed — " + (e.message || "invalid file"));
    }
  }

  function startAgEdit(a) {
    setAgEditId(a.id);
    setAgForm({
      name: a.name || "", phone: a.phone || "", website: a.website || "", areas: a.areas || "",
      blurb: a.blurb || "", contact_name: a.contact_name || "", email: a.email || "",
      monthly_fee: a.monthly_fee != null ? String(a.monthly_fee) : "", paid_until: a.paid_until || "",
    });
    setMsg("");
  }

  const btn = (bg, color, border) => ({
    padding: "7px 12px", borderRadius: 8, border: border || "none", background: bg, color,
    fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
  });

  if (!ok) {
    return (
      <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}`, maxWidth: 360 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 22, color: T.ink, fontFamily: "Georgia, serif" }}>Admin access</h2>
        <input
          style={{ ...inputStyle, marginBottom: 10, letterSpacing: 4, maxWidth: 180 }}
          type="password" inputMode="numeric" placeholder="••••" value={pin}
          onChange={(e) => { setPin(e.target.value); setPinErr(""); }}
        />
        {pinErr && <p style={{ color: T.danger, fontSize: 13.5, fontWeight: 600, margin: "0 0 10px" }}>{pinErr}</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" style={btn(T.primary, "#fff")} onClick={() => (pin === ADMIN_PIN ? setOk(true) : setPinErr("Wrong passcode."))}>Enter</button>
          <button type="button" style={btn("#fff", T.inkSoft, `1.5px solid ${T.line}`)} onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "20px 16px", border: `1px solid ${T.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: T.ink, fontFamily: "Georgia, serif" }}>Admin</h2>
        <button type="button" style={btn("#fff", T.ink, `1.5px solid ${T.line}`)} onClick={onBack}>Exit</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {[["caregivers", `Caregivers (${rows.filter((r) => !r.approved).length} pending)`], ["agencies", `Agencies (${ags.length})`], ["status", "📊 Status"], ["backup", "💾 Backup"], ["demo", "🌱 Demo"]].map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            style={btn(tab === id ? T.primary : "#fff", tab === id ? "#fff" : T.ink, `1.5px solid ${tab === id ? T.primary : T.line}`)}>
            {label}
          </button>
        ))}
      </div>
      {msg && <p style={{ fontSize: 13.5, fontWeight: 600, color: T.primary, margin: "0 0 10px" }}>{msg}</p>}

      {tab === "caregivers" ? (
        rows.length === 0 ? <p style={{ color: T.inkSoft }}>No caregiver records.</p> :
        rows.map((r) => (
          <div key={r.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 8px", borderBottom: `1px solid ${T.line}`, background: r.approved ? "transparent" : "#FCF4E3", borderRadius: 8, marginBottom: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: T.surface, flexShrink: 0 }}>
              {r.photo_url && <img src={r.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: T.ink }}>
                {r.name} {r.featured && <span style={{ color: T.amber }}>★</span>}
              </div>
              <div style={{ fontSize: 12.5, color: T.inkSoft }}>
                {r.city} {r.zip} · {new Date(r.created_at).toLocaleDateString()} · {r.approved ? "✓ approved" : "⏳ PENDING"}
                {r.cert_photo_url && (
                  <> · <a href={r.cert_photo_url} target="_blank" rel="noopener noreferrer" style={{ color: T.primary, fontWeight: 700 }}>📄 View license</a></>
                )}
              </div>
            </div>
            <button type="button" style={btn(r.approved ? "#fff" : T.primary, r.approved ? T.danger : "#fff", r.approved ? `1.5px solid ${T.line}` : "none")}
              onClick={() => patch("caregivers", r.id, { approved: !r.approved })}>
              {r.approved ? "Revoke" : "Approve"}
            </button>
            <button type="button" style={btn("#fff", r.featured ? T.amber : T.inkSoft, `1.5px solid ${T.line}`)} title="Toggle featured"
              onClick={() => patch("caregivers", r.id, { featured: !r.featured })}>
              ★
            </button>
            <button type="button" style={btn("#fff", T.inkSoft, `1.5px solid ${T.line}`)} onClick={() => remove("caregivers", r.id, r.name)}>✕</button>
          </div>
        ))
      ) : tab === "status" ? (
        <div>
          {(() => {
            const pending = rows.filter((r) => !r.approved).length;
            const withPhotos = rows.filter((r) => r.photo_url).length;
            const capPct = Math.round((rows.length / 4000) * 100);
            const today = new Date().toISOString().slice(0, 10);
            const expiredAgs = ags.filter((a) => a.paid_until && a.paid_until < today).length;
            const alerts = [];
            if (dbPing === "error") alerts.push(["crit", "Database unreachable — check status.supabase.com and whether the project is paused."]);
            else if (typeof dbPing === "number" && dbPing > 2000) alerts.push(["crit", `Database responding very slowly (${dbPing} ms, threshold 2000 ms).`]);
            else if (typeof dbPing === "number" && dbPing > 800) alerts.push(["warn", `Database slow (${dbPing} ms, threshold 800 ms) — watch for repeats.`]);
            if (pending >= 10) alerts.push(["warn", `${pending} caregivers pending review (threshold 10) — approve or remove them.`]);
            else if (pending > 0) alerts.push(["info", `${pending} caregiver(s) awaiting your review.`]);
            if (expiredAgs > 0) alerts.push(["warn", `${expiredAgs} agency ad(s) expired — collect payment (+1 mo) or remove.`]);
            if (capPct >= 75) alerts.push(["warn", `Caregiver count at ${capPct}% of free-tier photo capacity (~4,000) — plan the Supabase Pro upgrade.`]);
            const colors = { crit: T.danger, warn: T.amber, info: T.primary };
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    ["Database", dbPing === "error" ? "DOWN" : dbPing == null ? "checking…" : `OK · ${dbPing} ms`, dbPing === "error" ? T.danger : typeof dbPing === "number" && dbPing > 800 ? T.amber : T.primary],
                    ["Caregivers", `${rows.length} total · ${pending} pending`, pending >= 10 ? T.amber : T.primary],
                    ["Photos stored", `${withPhotos} (~${Math.round(withPhotos * 0.2)} MB est.)`, T.primary],
                    ["Capacity used", `${capPct}% of free tier`, capPct >= 75 ? T.amber : T.primary],
                    ["Care requests", String(jobsCount), T.primary],
                    ["Reviews", String(revsCount), T.primary],
                    ["Hires reported", String(hiresCount), T.primary],
                    ["Agencies", `${ags.filter((a) => a.active).length} active · ${expiredAgs} expired`, expiredAgs > 0 ? T.amber : T.primary],
                    ["App version", APP_VERSION, T.primary],
                  ].map(([k, v, c]) => (
                    <div key={k} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.inkSoft, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: c, marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontWeight: 800, fontSize: 15, color: T.ink, marginBottom: 8 }}>Alerts & actions</div>
                {alerts.length === 0 ? (
                  <div style={{ padding: "10px 12px", background: "#EFF6F3", border: `1px solid ${T.primary}`, borderRadius: 10, fontSize: 14, color: T.ink }}>
                    ✅ All systems normal — no action needed.
                  </div>
                ) : (
                  alerts.map(([lvl, text], i) => (
                    <div key={i} style={{ padding: "10px 12px", background: lvl === "crit" ? "#FBEAE5" : lvl === "warn" ? "#FCF4E3" : "#EFF6F3", border: `1px solid ${colors[lvl]}`, borderRadius: 10, fontSize: 14, color: T.ink, marginBottom: 8 }}>
                      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", marginRight: 8, background: colors[lvl] }} />
                      {text}
                    </div>
                  ))
                )}
                <button type="button" style={{ ...btn("#fff", T.primary, `1.5px solid ${T.primary}`), marginTop: 12 }} onClick={() => { ping(); refresh(); }}>
                  ↻ Re-check now
                </button>
                <p style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 14, lineHeight: 1.5 }}>
                  This panel checks while you're looking at it. For 24/7 down-time alerts sent to your email,
                  add a free UptimeRobot monitor for kajingcare.com (checks every 5 minutes).
                </p>
              </>
            );
          })()}
        </div>
      ) : tab === "demo" ? (
        <div>
          <p style={{ fontSize: 14, color: T.inkSoft, lineHeight: 1.6, marginTop: 0 }}>
            <strong style={{ color: T.ink }}>Seed demo events</strong> populates the analytics tables
            with realistic-looking activity — profile views, contact reveals, and searches spread across
            the last 30 days. Use this so the Agency Reports dashboard looks alive during your road show.
            <br /><br />
            Safe to run multiple times; each click adds more data.
          </p>
          <button type="button"
            style={{ ...btn(T.primary, "#fff"), fontSize: 15, padding: "12px 18px" }}
            onClick={async () => {
              try {
                setMsg("Seeding…");
                const n = await seedDemoEvents();
                setMsg(`${L.demoSeedDone} ${n}`);
              } catch (e) {
                setMsg(L.demoSeedFail);
                console.error("seed error:", e);
              }
            }}>
            🌱 {L.demoSeedBtn}
          </button>
        </div>
      ) : tab === "backup" ? (
        <div>
          <p style={{ fontSize: 14, color: T.inkSoft, lineHeight: 1.6, marginTop: 0 }}>
            <strong style={{ color: T.ink }}>Export</strong> downloads every record — caregivers, care requests,
            reviews, and agencies — as a single JSON file. Save it somewhere safe (your computer, email, cloud drive).
            <br /><br />
            <strong style={{ color: T.ink }}>Restore</strong> reads that same file back: missing records are
            re-created and existing ones are updated by ID. Safe to run on a live database.
            <br /><br />
            Note: photos live in Supabase Storage — the backup contains their links, not the image files.
            As long as Storage is intact, a restore brings everything back including photos.
          </p>
          <button type="button" style={{ ...btn(T.primary, "#fff"), fontSize: 15, padding: "12px 18px" }} onClick={exportAll}>
            ⬇ Export all data
          </button>
          <div style={{ marginTop: 14 }}>
            <label style={{ ...btn("#fff", T.primary, `1.5px solid ${T.primary}`), fontSize: 15, padding: "12px 18px", display: "inline-block" }}>
              ⬆ Restore from backup file
              <input
                type="file"
                accept="application/json,.json"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) importAll(f); e.target.value = ""; }}
              />
            </label>
          </div>
        </div>
      ) : (
        <>
          <div style={{ background: T.surface, borderRadius: 12, padding: 14, marginBottom: 14, border: `1px solid ${T.line}` }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: T.ink, marginBottom: 8 }}>{agEditId ? "✎ Editing agency — save to apply changes" : "Add agency ad (after they've paid)"}</div>
            <input style={{ ...inputStyle, marginBottom: 8 }} placeholder="Agency name *" value={agForm.name} onChange={(e) => setAgForm({ ...agForm, name: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={inputStyle} placeholder="Phone" value={agForm.phone} onChange={(e) => setAgForm({ ...agForm, phone: e.target.value })} />
              <input style={inputStyle} placeholder="Website (https://…)" value={agForm.website} onChange={(e) => setAgForm({ ...agForm, website: e.target.value })} />
            </div>
            <input style={{ ...inputStyle, marginBottom: 8 }} placeholder="Service areas (e.g. Queens, Brooklyn)" value={agForm.areas} onChange={(e) => setAgForm({ ...agForm, areas: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={inputStyle} placeholder="Contact person" value={agForm.contact_name} onChange={(e) => setAgForm({ ...agForm, contact_name: e.target.value })} />
              <input style={inputStyle} type="email" placeholder="Billing email" value={agForm.email} onChange={(e) => setAgForm({ ...agForm, email: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={inputStyle} inputMode="numeric" placeholder="Monthly fee ($)" value={agForm.monthly_fee} onChange={(e) => setAgForm({ ...agForm, monthly_fee: e.target.value })} />
              <input style={inputStyle} type="date" title="Paid until" value={agForm.paid_until} onChange={(e) => setAgForm({ ...agForm, paid_until: e.target.value })} />
            </div>
            <textarea style={{ ...inputStyle, minHeight: 60, marginBottom: 8 }} placeholder="Short blurb shown to families" value={agForm.blurb} onChange={(e) => setAgForm({ ...agForm, blurb: e.target.value })} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" style={btn(T.primary, "#fff")} onClick={addAgency}>{agEditId ? "Save changes" : "Publish agency ad"}</button>
              {agEditId && (
                <button type="button" style={btn("#fff", T.inkSoft, `1.5px solid ${T.line}`)} onClick={() => { setAgEditId(null); setAgForm(blankAgForm); }}>Cancel edit</button>
              )}
            </div>
          </div>
          {ags.map((a) => {
            const today = new Date().toISOString().slice(0, 10);
            const expired = a.paid_until && a.paid_until < today;
            const renew = () => {
              const base = a.paid_until && a.paid_until >= today ? new Date(a.paid_until + "T00:00:00") : new Date();
              base.setMonth(base.getMonth() + 1);
              patch("agencies", a.id, { paid_until: base.toISOString().slice(0, 10) });
            };
            return (
            <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 8px", borderBottom: `1px solid ${T.line}`, background: expired ? "#FBEAE5" : "transparent", borderRadius: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: T.ink }}>
                  {a.name} {!a.active && <span style={{ color: T.danger, fontSize: 12 }}>(paused)</span>}
                  {expired && <span style={{ color: T.danger, fontSize: 12, fontWeight: 800 }}> · EXPIRED — ad hidden</span>}
                </div>
                <div style={{ fontSize: 12.5, color: T.inkSoft }}>
                  {a.areas} · {a.phone}{a.contact_name ? ` · ${a.contact_name}` : ""}{a.email ? ` · ${a.email}` : ""}
                </div>
                <div style={{ fontSize: 12.5, color: expired ? T.danger : T.inkSoft, fontWeight: 600 }}>
                  {a.monthly_fee ? `$${a.monthly_fee}/mo · ` : ""}{a.paid_until ? `paid until ${a.paid_until}` : "no billing date set"}
                </div>
              </div>
              <button type="button" style={btn("#fff", T.primary, `1.5px solid ${T.line}`)} title="Edit agency details" onClick={() => startAgEdit(a)}>✎</button>
              <button type="button" style={btn(T.amber, "#3A2A08")} title="Extend one month (payment received)" onClick={renew}>+1 mo</button>
              <button type="button" style={btn("#fff", a.active ? T.danger : T.primary, `1.5px solid ${T.line}`)}
                onClick={() => patch("agencies", a.id, { active: !a.active })}>
                {a.active ? "Pause" : "Activate"}
              </button>
              <button type="button" style={btn("#fff", T.inkSoft, `1.5px solid ${T.line}`)} onClick={() => remove("agencies", a.id, a.name)}>✕</button>
            </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ---------- Legal pages ----------
const LEGAL = {
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: July 16, 2026",
    sections: [
      ["Information we collect", "When you create an aide profile, we collect the information you provide: your name, photo, phone number, email, city and ZIP code, age, years of experience, hourly rate, languages, services, certifications, and bio. Visitors searching the directory do not need an account and we do not collect their personal information."],
      ["How your information is used", "Aide profile information is displayed publicly in the Kajing Care directory so that families seeking care can find and contact you. That is the sole purpose of the directory. We do not sell your personal information."],
      ["Your choices", "You may edit or remove your profile at any time. When you remove your profile, it is no longer shown in the directory. To request removal assistance, contact us using the information below."],
      ["Photos", "Your profile photo is stored and displayed with your profile. Do not upload photos of other people without their permission."],
      ["Data security", "We take reasonable measures to protect the information stored in the directory. However, information you choose to publish in your profile is public by design — do not include information you do not want visible to others (such as your home address)."],
      ["Children", "Kajing Care is intended for adults. We do not knowingly collect information from anyone under 18."],
      ["Contact", "Questions about this policy? Contact us at privacy@kajingcare.com."],
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "Last updated: July 18, 2026",
    sections: [
      ["What Kajing Care is", "Kajing Care Inc operates a referral platform and directory that helps families find independent caregivers for home care needs, including senior care, child care, and household support. We are not an employer, staffing agency, home care agency, or healthcare provider. Caregivers listed on the platform are independent individuals, not our employees, contractors, or agents. We do not assign, supervise, schedule, or direct any caregiver's work."],
      ["Verification and its limits", "Caregiver profiles are reviewed by Kajing Care before appearing in the directory, and the \u201cVerified\u201d badge indicates that we have reviewed the identity and stated credentials the caregiver provided. Verification is a good-faith review, not a guarantee of any person's qualifications, character, or future conduct. Families remain solely responsible for interviewing candidates, checking references, obtaining any background checks they consider necessary, and making their own hiring decisions."],
      ["Memberships and payments", "Certain features, including access to caregivers' full profiles and contact information, require a paid membership or a one-time single unlock. Fees are displayed before purchase. Memberships run for the period purchased and, when auto-renewal is offered and enabled, renew until cancelled; cancellation stops future renewals and takes effect at the end of the current period. Except where required by law, fees are non-refundable once access has been provided. Prices may change with notice; changes apply to future purchases and renewals only."],
      ["Replacement matching", "During an active membership, members may contact additional caregivers and post care requests at no additional platform charge, including when a previous caregiver becomes unavailable. This benefit is continued access to the platform's matching tools; it is not a guarantee that any particular caregiver, or any caregiver at all, will be available, suitable, or willing to accept an engagement."],
      ["Caregiver responsibilities", "By creating a profile, you confirm that all information you provide is truthful and accurate, that you are legally permitted to work in the United States, that certifications you list are genuine and current, and that you will keep your profile up to date. Misrepresentation is grounds for removal from the platform."],
      ["Featured listings", "Caregivers may pay for featured placement in search results. Featured status is a paid promotional position and is labeled as such; it does not reflect a ranking of quality by Kajing Care."],
      ["Reviews", "Reviews must reflect the reviewer's genuine, first-hand experience. We may remove reviews that are false, abusive, unrelated to caregiving services, or that violate these terms, but we do not undertake to monitor all content and are not responsible for user-submitted content. Caregivers and clients may not offer or accept anything of value in exchange for reviews."],
      ["Hiring arrangements", "Any employment or service arrangement — including wages, schedules, duties, taxes, withholding, workers' compensation, and insurance — is strictly between the family and the caregiver. Families who hire a caregiver directly may become household employers with legal and tax obligations; consult a qualified professional. Kajing Care is not a party to any such arrangement and is not responsible for the acts or omissions of any user."],
      ["Acceptable use", "You may not post false information, impersonate others, harass or discriminate against users, scrape or resell platform data, circumvent payment features, or use the platform for any unlawful purpose. We may suspend or remove accounts, profiles, posts, or reviews that violate these terms."],
      ["Disclaimer and limitation of liability", "The platform is provided \u201cas is\u201d and \u201cas available\u201d without warranties of any kind, express or implied. To the fullest extent permitted by law, Kajing Care Inc is not liable for any indirect, incidental, special, consequential, or punitive damages, or for any damages arising from your use of the platform or from any arrangement, interaction, or dispute between users. Where liability cannot be excluded, our total liability is limited to the amounts you paid to us in the twelve months before the claim arose."],
      ["Changes to these terms", "We may update these terms from time to time. We will post the updated terms with a new \u201cLast updated\u201d date, and continued use of the platform after changes take effect means you accept the updated terms."],
      ["Contact", "Questions about these terms? Contact us at support@kajingcare.com."],
    ],
  },
};

function LegalPage({ kind, onBack }) {
  const { L } = useLang();
  const doc = LEGAL[kind];
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16, padding: "8px 14px", borderRadius: 999,
          border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {L.back}
      </button>
      <h2 style={{ margin: "0 0 4px", fontSize: 26, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {doc.title}
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 13.5, color: T.inkSoft }}>{doc.updated}</p>
      {doc.sections.map(([heading, body]) => (
        <div key={heading} style={{ marginBottom: 18 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 17, color: T.ink }}>{heading}</h3>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.inkSoft }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

// ---------- Backup / Restore (testing utility) ----------
function BackupPanel({ aides, onRestore, onBack }) {
  const { L } = useLang();
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState("");
  const exportText = JSON.stringify(aides);

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportText);
      setStatus("Copied " + aides.length + " profile(s) to clipboard ✓");
    } catch (e) {
      setStatus("Couldn't auto-copy — tap the box below, select all, and copy manually.");
    }
  }

  async function doImport() {
    setStatus("");
    let records;
    try {
      records = JSON.parse(importText);
      if (!Array.isArray(records)) throw new Error();
    } catch (e) {
      setStatus("That doesn't look like valid backup text. Paste the full export, starting with [ and ending with ].");
      return;
    }
    let ok = 0;
    for (const rec of records) {
      if (!rec?.id || !rec?.name) continue;
      try {
        await sbInsert("caregivers", aideToDb(rec));
        ok++;
      } catch (e) { /* skip */ }
    }
    setStatus("Restored " + ok + " profile(s) ✓");
    onRestore(records.filter((r) => r?.id && r?.name));
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16, padding: "8px 14px", borderRadius: 999,
          border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {L.back}
      </button>
      <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        Backup & restore (testing)
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>
        The demo database resets when the app is updated to a new version. Before an update, copy your
        backup text and save it anywhere (Notepad, an email to yourself). After the update, paste it below to restore.
      </p>

      <h3 style={{ margin: "0 0 8px", fontSize: 16.5, color: T.ink }}>1 · Export current profiles ({aides.length})</h3>
      <button
        type="button"
        onClick={copyExport}
        style={{
          padding: "12px 18px", borderRadius: 10, border: "none", background: T.primary,
          color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginBottom: 8,
        }}
      >
        Copy backup to clipboard
      </button>
      <textarea
        readOnly
        value={exportText}
        onFocus={(e) => e.target.select()}
        style={{ ...inputStyle, minHeight: 80, fontSize: 12, fontFamily: "monospace", marginBottom: 20 }}
      />

      <h3 style={{ margin: "0 0 8px", fontSize: 16.5, color: T.ink }}>2 · Restore from a backup</h3>
      <textarea
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        placeholder="Paste your backup text here…"
        style={{ ...inputStyle, minHeight: 80, fontSize: 12, fontFamily: "monospace", marginBottom: 8 }}
      />
      <button
        type="button"
        onClick={doImport}
        style={{
          padding: "12px 18px", borderRadius: 10, border: `1.5px solid ${T.primary}`, background: "#fff",
          color: T.primary, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        Restore profiles
      </button>
      {status && <p style={{ marginTop: 10, marginBottom: 0, fontSize: 14, fontWeight: 600, color: T.primary }}>{status}</p>}
    </div>
  );
}

// ---------- Home landing (v3.10) — three-vertical umbrella brand ----------
function HomeLandingView({ onPickCategory, onSignIn, isSignedIn }) {
  const { L } = useLang();

  // Three verticals with distinct color moods that harmonize
  const verticals = [
    {
      id: "care",
      emoji: "🏡",
      color: T.primary,
      dark: T.primaryDark,
      soft: "#EFF6F3",
      image: "https://images.pexels.com/photos/7551654/pexels-photo-7551654.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
      en: "Kajing Care",
      zhLabel: "照護",
      tag: L.landingCareTag,
      items: L.landingCareItems,
    },
    {
      id: "learn",
      emoji: "📚",
      color: "#3F6795",
      dark: "#2F507A",
      soft: "#EDF2F8",
      image: "https://images.pexels.com/photos/7570775/pexels-photo-7570775.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
      en: "Kajing Learn",
      zhLabel: "學習",
      tag: L.landingLearnTag,
      items: L.landingLearnItems,
    },
    {
      id: "kids",
      emoji: "🎨",
      color: "#D97848",
      dark: "#B15E33",
      soft: "#FBF1E9",
      image: "https://images.pexels.com/photos/9044049/pexels-photo-9044049.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
      en: "Kajing Kids",
      zhLabel: "兒童",
      tag: L.landingKidsTag,
      items: L.landingKidsItems,
    },
  ];

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 16px 40px" }}>
      {/* HERO */}
      <section style={{
        textAlign: "center", padding: "36px 20px 40px", marginBottom: 26,
        background: `linear-gradient(180deg, ${T.surface} 0%, #FFF 100%)`,
        borderRadius: 20, border: `1px solid ${T.line}`,
      }}>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: 6, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
          家家通
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.primary, letterSpacing: 4, marginTop: 4 }}>
          KAKATONG
        </div>
        <h1 style={{ margin: "18px auto 8px", maxWidth: 720, fontSize: 26, fontWeight: 800, color: T.ink, lineHeight: 1.3, fontFamily: "Georgia, serif" }}>
          {L.landingHeroTitle}
        </h1>
        <p style={{ margin: "0 auto", maxWidth: 640, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.55 }}>
          {L.landingHeroSub}
        </p>
        {!isSignedIn && (
          <button
            type="button"
            onClick={onSignIn}
            style={{
              marginTop: 20, padding: "11px 22px", borderRadius: 999,
              border: "none", background: T.amber, color: "#3A2A08",
              fontSize: 14.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {L.landingHeroCta}
          </button>
        )}
      </section>

      {/* SECTION HEADING */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: "Georgia, serif" }}>
          {L.pickCategoryTitle}
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: T.inkSoft }}>
          {L.pickCategorySub}
        </p>
      </div>

      {/* THREE VERTICAL CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16, marginBottom: 32,
      }}>
        {verticals.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onPickCategory(v.id)}
            style={{
              textAlign: "left",
              padding: 0,
              background: "#fff",
              border: `1px solid ${T.line}`,
              borderRadius: 18,
              cursor: "pointer",
              overflow: "hidden",
              fontFamily: "inherit",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
            }}
          >
            {/* v3.10.1 — image banner with small emoji badge overlay */}
            <div style={{
              position: "relative",
              height: 170,
              overflow: "hidden",
              borderBottom: `3px solid ${v.color}`,
              background: v.soft,
            }}>
              <img
                src={v.image}
                alt={v.en}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                width: 42,
                height: 42,
                borderRadius: 999,
                background: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}>
                {v.emoji}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "18px 20px 22px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: v.dark, fontFamily: "Georgia, serif" }}>
                  {v.en}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.inkSoft }}>
                  家家通 · {v.zhLabel}
                </span>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: T.inkSoft, lineHeight: 1.5 }}>
                {v.tag}
              </p>
              <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none" }}>
                {v.items.map((item, i) => (
                  <li key={i} style={{ fontSize: 13.5, color: T.ink, padding: "3px 0" }}>
                    · {item}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "9px 16px", borderRadius: 10,
                  background: v.color, color: "#fff",
                  fontSize: 14, fontWeight: 800,
                }}
              >
                {L.landingBrowse} →
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section style={{ marginTop: 30, padding: "26px 20px", background: "#fff", borderRadius: 16, border: `1px solid ${T.line}` }}>
        <h2 style={{ margin: "0 0 18px", textAlign: "center", fontSize: 19, fontWeight: 800, color: T.ink, fontFamily: "Georgia, serif" }}>
          {L.howItWorksTitle}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}>
          {[
            [1, L.step1Title, L.step1Sub],
            [2, L.step2Title, L.step2Sub],
            [3, L.step3Title, L.step3Sub],
          ].map(([n, title, sub]) => (
            <div key={n} style={{ textAlign: "center", padding: "0 8px" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 40, height: 40, borderRadius: 999,
                background: T.primary, color: "#fff", fontSize: 17, fontWeight: 800,
                marginBottom: 10,
              }}>
                {n}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.5 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- Main app ----------
export default function App() {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem("pcc_lang");
      if (saved && STRINGS[saved]) return saved;
    } catch (e) { /* storage unavailable */ }
    try {
      const nav = (navigator.language || "").toLowerCase();
      if (nav.startsWith("zh")) return "zh";
      if (nav.startsWith("es")) return "es";
    } catch (e) { /* no navigator */ }
    return "en";
  });
  const setLang = (id) => {
    setLangState(id);
    try { localStorage.setItem("pcc_lang", id); } catch (e) { /* storage unavailable */ }
  };
  const L = STRINGS[lang];
  const ts = (s) => (lang === "en" ? s : SERVICE_I18N[s]?.[lang] || s);
  LANG_CURRENT = { lang, L, ts };
  const [view, setView] = useState("home"); // home | directory | register | postjob | plans | privacy | terms | backup
  const [category, setCategory] = useState(null); // v3.10: care | learn | kids — set from home landing
  const [tab, setTab] = useState("aides"); // aides | jobs
  const [editing, setEditing] = useState(null); // aide record being edited, or null
  const [jobEditing, setJobEditing] = useState(null); // job record being edited, or null
  const [aides, setAides] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [dbError, setDbError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(0); // v3.9: 0 = exact match; 1, 5, 10 = miles from ZIP
  const [serviceFilter, setServiceFilter] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [toast, setToast] = useState("");
  const [client, setClient] = useState(null); // { plan, subscribedUntil }
  const [account, setAccount] = useState(null); // { id, email, name }
  const [authNext, setAuthNext] = useState(null); // resume action after sign-in
  const subscribed = !!(client && client.subscribedUntil > Date.now());
  const [pendingUnlock, setPendingUnlock] = useState(null);
  const unlockedIds = client?.unlocks || [];
  const [aidePro, setAidePro] = useState(null);
  const isAidePro = !!(aidePro && aidePro.proUntil > Date.now());
  const [pendingCount, setPendingCount] = useState(0); // v3.8: caregivers awaiting approval

  // v3.8.5 — aides can't see the aides directory (own competitors); pick a valid tab
  const isAideRole = account?.role === "aide";
  const visibleTabIds = isAideRole ? ["jobs", "agencies"] : ["aides", "jobs", "agencies"];
  const effectiveTab = visibleTabIds.includes(tab) ? tab : visibleTabIds[0];
  useEffect(() => {
    if (effectiveTab !== tab) setTab(effectiveTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveTab]);
  const [lastSearchId, setLastSearchId] = useState(null);   // tracking: search_query id

  useEffect(() => {
    (async () => {
      try {
        setAides(await loadAides());
        setJobs(await loadJobs());
        setReviews(await loadReviews());
        setAgencies(await loadAgencies());
        setHires(await loadHires());
        setDbError(false);
      } catch (e) {
        setDbError(true);
      }
      setLoading(false);
      let signedIn = false;
      try {
        const sess = JSON.parse(localStorage.getItem("pcc_session") || "null");
        if (sess && sess.user && sess.user.id) {
          signedIn = true;
          // PIN and phone sessions carry a role already; email sessions do not
          setAccount(sess.user);
          const m = await fetchMember(sess.user.id);
          if (m) {
            setClient({
              plan: m.plan,
              subscribedUntil: m.subscribed_until ? Date.parse(m.subscribed_until) : 0,
              unlocks: m.unlocks || [],
            });
          }
        }
      } catch (e) { /* not signed in */ }
      try {
        if (!signedIn) {
          const saved = localStorage.getItem("pcc_client");
          if (saved) setClient(JSON.parse(saved));
        }
      } catch (e) { /* no membership yet */ }
      try {
        const savedPro = localStorage.getItem("pcc_aidepro");
        if (savedPro) setAidePro(JSON.parse(savedPro));
      } catch (e) { /* not aide pro */ }
    })();
  }, []);

  // v3.8 — poll pending caregiver approvals: on mount, when tab becomes visible, and every 60s
  useEffect(() => {
    let stopped = false;
    const refresh = async () => {
      const n = await fetchPendingCount();
      if (!stopped) setPendingCount(n);
    };
    refresh();
    const onVis = () => { if (document.visibilityState === "visible") refresh(); };
    const iv = setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", refresh);
    return () => {
      stopped = true;
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  async function addHire(caregiverId, name) {
    const saved = await sbInsert("hires", { caregiver_id: caregiverId, client_name: name });
    setHires((list) => [saved, ...list]);
    showToast(L.tHired);
  }

  async function addReview(caregiverId, rev) {
    const saved = await sbInsert("reviews", {
      caregiver_id: caregiverId,
      reviewer_name: rev.name,
      rating: rev.rating,
      comment: rev.comment || null,
    });
    setReviews((list) => [saved, ...list]);
    showToast(L.tReview);
  }

  async function handleDeleteJob(job) {
    try {
      await sbDelete("care_requests", job.id);
    } catch (e) { /* ignore */ }
    setJobs((list) => list.filter((j) => j.id !== job.id));
    showToast(L.tJobRem);
  }

  async function activatePlan(plan, acct = account) {
    if (!acct) {
      setAuthNext({ type: "plan", plan });
      setView("signin");
      window.scrollTo(0, 0);
      return;
    }
    const rec = {
      ...(client || {}),
      plan: plan.name,
      subscribedUntil: Date.now() + plan.months * 30 * 24 * 3600 * 1000,
      activatedAt: Date.now(),
    };
    try {
      await upsertMember({
        user_id: acct.id,
        email: acct.email || null,
        phone: acct.phone || null,
        name: acct.name || null,
        plan: rec.plan,
        subscribed_until: new Date(rec.subscribedUntil).toISOString(),
        unlocks: rec.unlocks || [],
      });
    } catch (e) {
      // Surface member-save failures so we notice them (v3.5.1)
      showToast("Save failed — please try again");
      console.error("upsertMember failed:", e);
      return;
    }
    try {
      localStorage.setItem("pcc_client", JSON.stringify(rec));
    } catch (e) { /* still activate in-session */ }
    setClient(rec);
    setPendingUnlock(null);
    setView("directory");
    showToast(L.tMember);
  }

  function signOut() {
    try {
      localStorage.removeItem("pcc_session");
      localStorage.removeItem("pcc_client");
      localStorage.removeItem("pcc_aidepro");
    } catch (e) { /* ignore */ }
    setAccount(null);
    setClient(null);
    setAidePro(null);
    // v3.8.2: also clear directory filters and per-session tracking so a new
    // sign-in doesn't inherit the previous user's search/context
    setSearch("");
    setRadius(0);
    setServiceFilter("");
    setMaxRate("");
    setMinAge("");
    setMaxAge("");
    setLastSearchId(null);
    setEditing(null);
    setPendingUnlock(null);
    setAuthNext(null);
    setTab("aides");
  }

  async function activateAidePro() {
    const rec = { proUntil: Date.now() + 30 * 24 * 3600 * 1000, activatedAt: Date.now() };
    try {
      localStorage.setItem("pcc_aidepro", JSON.stringify(rec));
    } catch (e) { /* keep in-session */ }
    setAidePro(rec);
    showToast(L.tAidePro);
  }

  async function activateSingleUnlock(acct = account) {
    if (!pendingUnlock) return;
    if (!acct) {
      setAuthNext({ type: "unlock" });
      setView("signin");
      window.scrollTo(0, 0);
      return;
    }
    const rec = { ...(client || {}), unlocks: [...(client?.unlocks || []), pendingUnlock] };
    try {
      await upsertMember({
        user_id: acct.id,
        email: acct.email || null,
        phone: acct.phone || null,
        name: acct.name || null,
        plan: rec.plan || null,
        subscribed_until: rec.subscribedUntil ? new Date(rec.subscribedUntil).toISOString() : null,
        unlocks: rec.unlocks,
      });
    } catch (e) {
      showToast("Save failed — please try again");
      console.error("upsertMember failed:", e);
      return;
    }
    try {
      localStorage.setItem("pcc_client", JSON.stringify(rec));
    } catch (e) { /* keep in-session */ }
    setClient(rec);
    setPendingUnlock(null);
    setView("directory");
    showToast(L.tUnlocked);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  async function handleDelete(aide) {
    try {
      await sbDelete("caregivers", aide.id);
    } catch (e) { /* ignore */ }
    setAides((list) => list.filter((a) => a.id !== aide.id));
    showToast(L.tProfileRem);
  }

  const filtered = aides.filter((a) => {
    const q = search.trim();
    const qLower = q.toLowerCase();
    const isZipQuery = /^\d{5}$/.test(q);
    let matchQ;
    if (!q) {
      matchQ = true;
    } else if (isZipQuery && radius > 0) {
      // Radius mode: only aides whose ZIP is within `radius` miles of search ZIP
      matchQ = isZipWithinRadius(a.zip, q, radius);
    } else {
      matchQ = a.zip?.startsWith(q) || a.city?.toLowerCase().includes(qLower);
    }
    const matchS = !serviceFilter || a.services?.includes(serviceFilter);
    const rate = Number(a.rate);
    const age = Number(a.age);
    const matchRate = !maxRate || (a.rate !== "" && !isNaN(rate) && rate <= Number(maxRate));
    const matchMinAge = !minAge || (a.age !== "" && !isNaN(age) && age >= Number(minAge));
    const matchMaxAge = !maxAge || (a.age !== "" && !isNaN(age) && age <= Number(maxAge));
    return matchQ && matchS && matchRate && matchMinAge && matchMaxAge;
  });

  // Tracking: log each search (debounced 800ms so we don't log every keystroke)
  useEffect(() => {
    // Only track once the user has typed a ZIP/city OR set a filter
    if (!search.trim() && !serviceFilter && !maxRate && !minAge && !maxAge) return;
    const t = setTimeout(async () => {
      const sqId = await trackSearch({
        zip:           search.trim() || null,
        service:       serviceFilter || null,
        maxRate:       maxRate || null,
        ageFrom:       minAge || null,
        ageTo:         maxAge || null,
        resultsCount:  filtered.length,
        lang:          LANG_CURRENT.lang,
        memberSession: account,
      });
      setLastSearchId(sqId);
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, serviceFilter, maxRate, minAge, maxAge]);

  return (
    <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif", color: T.ink }}>
      {/* Header */}
      <header style={{ background: T.primaryDark, padding: "18px 20px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            {/* Sign in / Sign out button (v3.4) — always visible */}
            {account ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto", color: "#C9DAD4", fontSize: 13 }}>
                <span>👤 {account.name || account.email || account.phone}</span>
                {account.role === "agency" && (
                  <button type="button" onClick={() => { setView("agency-dashboard"); window.scrollTo(0, 0); }}
                    style={{
                      padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      border: `1.5px solid ${T.amber}`, background: T.amber, color: "#3A2A08",
                    }}>
                    📊 {L.agencyReports}
                  </button>
                )}
                {account.role === "aide" && (
                  <button type="button" onClick={async () => {
                    try {
                      const existing = await findCaregiverByPhone(account.phone);
                      setEditing(existing || emptyAideFromAccount(account));
                    } catch (e) {
                      setEditing(emptyAideFromAccount(account));
                    }
                    setView("register");
                    window.scrollTo(0, 0);
                  }}
                    style={{
                      padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      border: `1.5px solid ${T.amber}`, background: T.amber, color: "#3A2A08",
                    }}>
                    ✎ My Profile
                  </button>
                )}
                <button type="button" onClick={signOut}
                  style={{
                    padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    border: `1.5px solid rgba(255,255,255,0.35)`, background: "transparent", color: "#C9DAD4",
                  }}>
                  {L.signOut}
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => { setView("signin"); window.scrollTo(0, 0); }}
                style={{
                  padding: "5px 14px", borderRadius: 999, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                  border: `1.5px solid ${T.amber}`, background: T.amber, color: "#3A2A08",
                  marginRight: "auto",
                }}>
                {L.signInBtn}
              </button>
            )}
            {[["en", "EN"], ["zh", "中文"], ["es", "ES"]].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLang(id)}
                style={{
                  padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: `1.5px solid ${lang === id ? T.amber : "rgba(255,255,255,0.35)"}`,
                  background: lang === id ? T.amber : "transparent",
                  color: lang === id ? "#3A2A08" : "#C9DAD4",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={() => { setView("home"); window.scrollTo(0, 0); }}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
            >
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 26, color: "#fff", fontWeight: 700, letterSpacing: 0.2 }}>
                家家通 <span style={{ color: T.amber, fontSize: 22, letterSpacing: 2 }}>· Kakatong</span>
              </div>
              <div style={{ fontSize: 13.5, color: "#C9DAD4" }}>{L.tagline}</div>
            </button>
            {view === "directory" && (
              <button
                type="button"
                onClick={() => { setEditing(null); setView("register"); }}
                style={{
                  padding: "11px 16px", borderRadius: 10, border: "none",
                  background: T.amber, color: "#3A2A08", fontWeight: 800, fontSize: 15,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                }}
              >
                {L.join}
              </button>
            )}
          </div>
          {view === "directory" && (
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px", minWidth: 200 }}>
                <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#fff", fontSize: 22, margin: 0, lineHeight: 1.3, fontWeight: 700 }}>
                  {L.heroTitle}
                </h1>
                <p style={{ color: "#C9DAD4", fontSize: 14.5, margin: "8px 0 0", lineHeight: 1.5 }}>
                  {L.heroText}
                </p>
              </div>
              <div style={{ flex: "1 1 260px", minWidth: 240, background: "#FDFCF8", borderRadius: 14, padding: 8, border: `1px solid rgba(255,255,255,0.25)` }}>
                <HeroVisual />
              </div>
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 48px" }}>
        {dbError && (
          <div style={{ padding: "12px 16px", background: "#FBEAE5", border: `1.5px solid ${T.danger}`, borderRadius: 12, marginBottom: 14, fontSize: 14, color: T.ink }}>
            ⚠️ <strong>Could not reach the Kajing Care database.</strong> If you're seeing this inside the
            Claude preview, the sandbox may be blocking outside connections — the same code will work
            when deployed to real hosting. (Also check: is the Supabase project paused?)
          </div>
        )}
        {view === "home" ? (
          <HomeLandingView
            isSignedIn={!!account}
            onSignIn={() => { setView("signin"); window.scrollTo(0, 0); }}
            onPickCategory={(cat) => { setCategory(cat); setView("directory"); window.scrollTo(0, 0); }}
          />
        ) : view === "auth" ? (
          <AuthView
            onBack={() => { setAuthNext(null); setView("plans"); }}
            onDone={(acct) => {
              setAccount(acct);
              const next = authNext;
              setAuthNext(null);
              showToast(L.tSignedIn);
              if (next && next.type === "plan") activatePlan(next.plan, acct);
              else if (next && next.type === "unlock") activateSingleUnlock(acct);
              else setView("directory");
            }}
          />
        ) : view === "signin" ? (
          <PhoneAuthView
            onBack={() => { setAuthNext(null); setView("directory"); }}
            onDone={async (acct) => {
              setAccount(acct);
              // v3.8.2: clear any leftover filters/search from a prior session
              setSearch("");
              setRadius(0);
              setServiceFilter("");
              setMaxRate("");
              setMinAge("");
              setMaxAge("");
              setLastSearchId(null);
              // Restore any member subscription record for this account
              try {
                const m = await fetchMember(acct.id);
                if (m) {
                  setClient({
                    plan: m.plan,
                    subscribedUntil: m.subscribed_until ? Date.parse(m.subscribed_until) : 0,
                    unlocks: m.unlocks || [],
                  });
                }
              } catch (e) { /* not a subscriber yet — that's fine */ }
              showToast(L.tSignedIn);
              // If they were mid-way through activating a plan/unlock, continue it
              const next = authNext;
              setAuthNext(null);
              if (next && next.type === "plan") {
                activatePlan(next.plan, acct);
                return;
              }
              if (next && next.type === "unlock") {
                activateSingleUnlock(acct);
                return;
              }
              // Otherwise route by role
              if (acct.role === "aide") {
                // v3.7: unified aide flow — send them straight to their caregiver profile
                // (new record pre-filled with name/phone, or edit existing if found)
                try {
                  const existing = await findCaregiverByPhone(acct.phone);
                  setEditing(existing || emptyAideFromAccount(acct));
                } catch (e) {
                  setEditing(emptyAideFromAccount(acct));
                }
                setView("register");
                window.scrollTo(0, 0);
              } else if (acct.role === "agency") {
                setView("agency-dashboard");
              } else if (acct.role === "admin") {
                setView("admin");
              } else {
                setView("directory");
              }
            }}
          />
        ) : view === "aidelogin" ? (
          <AideLoginView
            onBack={() => setView("directory")}
            onFound={(rec) => { setEditing(rec); setView("register"); window.scrollTo(0, 0); }}
          />
        ) : view === "agency-dashboard" ? (
          <AgencyDashboardView
            account={account}
            subscribed={subscribed}
            onBack={() => setView("directory")}
            onUpgrade={() => { setView("plans"); window.scrollTo(0, 0); }}
          />
        ) : view === "admin" ? (
          <AdminView
            onBack={() => setView("directory")}
            onDataChanged={async () => {
              try {
                setAides(await loadAides());
                setAgencies(await loadAgencies());
                setPendingCount(await fetchPendingCount());
              } catch (e) { /* ignore */ }
            }}
          />
        ) : view === "faq" ? (
          <FaqView onBack={() => setView("directory")} />
        ) : view === "privacy" || view === "terms" ? (
          <LegalPage kind={view} onBack={() => setView("directory")} />
        ) : view === "backup" ? (
          <BackupPanel
            aides={aides}
            onRestore={(records) => {
              setAides((list) => {
                const map = new Map(list.map((a) => [a.id, a]));
                for (const r of records) map.set(r.id, r);
                return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
              });
            }}
            onBack={() => setView("directory")}
          />
        ) : view === "postjob" ? (
          <JobForm
            initial={jobEditing}
            onSaved={(rec) => {
              setJobs((list) => [rec, ...list.filter((j) => j.id !== rec.id)]);
              setJobEditing(null);
              setView("directory");
              setTab("jobs");
              showToast(jobEditing ? L.tJobUpd : L.tJobLive);
            }}
            onCancel={() => { setJobEditing(null); setView("directory"); }}
          />
        ) : view === "plans" ? (
          <PlansView onActivate={activatePlan} onBack={() => { setPendingUnlock(null); setView("directory"); }} singleUnlock={!!pendingUnlock} onSingleUnlock={activateSingleUnlock} />
        ) : view === "register" ? (
          <RegisterForm
            initial={editing}
            hidePin={account?.role === "aide"}
            onSaved={(rec) => {
              if (editing) {
                setAides((list) => list.map((a) => (a.id === rec.id ? rec : a)));
              }
              setEditing(null);
              setView("directory");
              showToast(editing ? L.tProfileUpd : L.tProfileLive);
            }}
            onCancel={() => { setEditing(null); setView("directory"); }}
          />
        ) : (
          <>
            {/* v3.10 — category breadcrumb when arriving from home landing */}
            {category && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "8px 12px", background: T.card, border: `1px solid ${T.line}`, borderRadius: 10 }}>
                <button
                  type="button"
                  onClick={() => { setCategory(null); setView("home"); window.scrollTo(0, 0); }}
                  style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                >
                  ← {L.landingBrowse === "Browse" ? "Home" : L.landingBrowse === "瀏覽" ? "首頁" : "Inicio"}
                </button>
                <span style={{ color: T.inkSoft, fontSize: 13 }}>·</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>
                  {category === "care" ? "Kajing Care · 照護" :
                   category === "learn" ? "Kajing Learn · 學習" :
                   category === "kids" ? "Kajing Kids · 兒童" : ""}
                </span>
              </div>
            )}
            {/* Tabs: find an aide / care requests. Aides don't see other aides. */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {visibleTabIds.map((id) => {
                const label = id === "aides" ? L.tabAides : id === "jobs" ? L.tabJobs : L.tabAgencies;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    style={{
                      flex: 1, padding: "11px 4px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                      fontSize: 14, fontWeight: 800,
                      border: `2px solid ${effectiveTab === id ? T.primary : T.line}`,
                      background: effectiveTab === id ? T.primary : "#fff",
                      color: effectiveTab === id ? "#fff" : T.ink,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {effectiveTab === "aides" && (
              <div style={{ textAlign: "right", marginBottom: 10 }}>
                <button
                  type="button"
                  onClick={() => { setView("aidelogin"); window.scrollTo(0, 0); }}
                  style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", padding: 0, textDecoration: "underline" }}
                >
                  {L.manageProfile}
                </button>
              </div>
            )}

            {effectiveTab === "jobs" ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <p style={{ margin: 0, fontSize: 14.5, color: T.inkSoft }}>
                    {L.jobsIntro}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setJobEditing(null); setView("postjob"); window.scrollTo(0, 0); }}
                    style={{
                      padding: "11px 16px", borderRadius: 10, border: "none",
                      background: T.primary, color: "#fff", fontWeight: 800, fontSize: 14.5,
                      cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                    }}
                  >
                    {L.postBtn}
                  </button>
                </div>
                {loading ? (
                  <p style={{ textAlign: "center", color: T.inkSoft, marginTop: 40 }}>{L.loadingJobs}</p>
                ) : jobs.length === 0 ? (
                  <div style={{ textAlign: "center", marginTop: 48 }}>
                    <div style={{ fontSize: 44 }}>📋</div>
                    <h3 style={{ margin: "10px 0 6px", fontFamily: "Georgia, serif", fontSize: 21 }}>{L.noJobsTitle}</h3>
                    <p style={{ color: T.inkSoft, fontSize: 15, margin: 0 }}>
                      {L.noJobsSub}
                    </p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 13.5, color: T.inkSoft, margin: "0 0 10px" }}>
                      {jobs.length} {L.openSuffix}
                    </p>
                    {jobs.map((j) => (
                      <JobCard
                        key={j.id}
                        job={j}
                        aidePro={isAidePro}
                        onAideProSignup={activateAidePro}
                        onDelete={handleDeleteJob}
                        onEdit={(rec) => { setJobEditing(rec); setView("postjob"); window.scrollTo(0, 0); }}
                      />
                    ))}
                  </>
                )}
              </>
            ) : effectiveTab === "agencies" ? (
              <>
                <h2 style={{ margin: "0 0 4px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, color: T.ink }}>
                  {L.partnersTitle}
                </h2>
                <p style={{ margin: "0 0 14px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>{L.partnersSub}</p>
                {agencies.length === 0 ? (
                  <div style={{ textAlign: "center", marginTop: 40 }}>
                    <div style={{ fontSize: 44 }}>🏛️</div>
                    <p style={{ color: T.inkSoft, fontSize: 15, margin: "10px 0 0" }}>{L.noAgencies}</p>
                  </div>
                ) : agencies.map((ag) => {
                  const canSee = subscribed || isAidePro;
                  return (
                  <div key={ag.id} style={{ background: "#F3F7F5", border: `1px solid ${T.line}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 16, color: T.ink }}>
                        {canSee ? ag.name : `🔒 ${L.agencyLocked}`}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: T.inkSoft, border: `1px solid ${T.line}`, borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>
                        {L.sponsoredTag}
                      </span>
                    </div>
                    {ag.areas && <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 2 }}>{ag.areas}</div>}
                    {ag.blurb && <p style={{ margin: "8px 0 0", fontSize: 14, color: T.ink, lineHeight: 1.5 }}>{ag.blurb}</p>}
                    <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
                      {canSee ? (
                        <>
                          {ag.phone && (
                            <a href={"tel:" + ag.phone} style={{ padding: "9px 16px", borderRadius: 10, background: T.primary, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                              {L.partnerCall} {ag.phone}
                            </a>
                          )}
                          {ag.website && (
                            <a href={ag.website} target="_blank" rel="noopener noreferrer" style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${T.primary}`, color: T.primary, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                              {L.partnerSite}
                            </a>
                          )}
                        </>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#FCF4E3", border: `1px solid ${T.amber}`, borderRadius: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, color: T.ink }}>{L.agencyLockedSub}</span>
                          <button
                            type="button"
                            onClick={() => { setView("plans"); window.scrollTo(0, 0); }}
                            style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: T.amber, color: "#3A2A08", fontWeight: 800, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            {L.agencyUnlockBtn}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
                <p style={{ fontSize: 13, color: T.inkSoft, marginTop: 16, lineHeight: 1.5 }}>{L.advertiseLine}</p>
              </>
            ) : (
            <>
            {/* Membership status */}
            {subscribed ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#EFF6F3", border: `1px solid ${T.primary}`, borderRadius: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <span style={{ fontSize: 14, color: T.ink }}>
                  <strong>{L.memberActive}</strong> {new Date(client.subscribedUntil).toLocaleDateString()}
                </span>
                <span style={{ flex: 1 }} />
                {account && (
                  <span style={{ fontSize: 12.5, color: T.inkSoft }}>{account.email}</span>
                )}
                {account && (
                  <button
                    type="button"
                    onClick={signOut}
                    style={{ background: "none", border: "none", color: T.primary, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
                  >
                    {L.signOut}
                  </button>
                )}
                {!account && <button
                  type="button"
                  title="Reset demo membership (testing)"
                  onClick={() => {
                    try { localStorage.removeItem("pcc_client"); localStorage.removeItem("pcc_aidepro"); } catch (e) { /* ignore */ }
                    setClient(null);
                    setAidePro(null);
                  }}
                  style={{ background: "none", border: "none", color: T.inkSoft, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
                >
                  reset
                </button>}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 14px", background: "#FCF4E3", border: `1px solid ${T.amber}`, borderRadius: 12, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, color: T.ink }}>
                  {L.browseFree} <strong>{L.membersContact}</strong>{" "}
                  <button
                    type="button"
                    onClick={() => { setView("faq"); window.scrollTo(0, 0); }}
                    style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", padding: 0, textDecoration: "underline" }}
                  >
                    {L.whyMembership}
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => { setPendingUnlock(null); setView("plans"); window.scrollTo(0, 0); }}
                  style={{
                    padding: "9px 16px", borderRadius: 999, border: "none", background: T.amber,
                    color: "#3A2A08", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {L.seePlans}
                </button>
              </div>
            )}

            {/* Client search + filters */}
            <h2 style={{ margin: "0 0 4px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, color: T.ink }}>
              {L.findTitle}
            </h2>
            <p style={{ margin: "0 0 12px", fontSize: 14.5, color: T.inkSoft }}>
              {L.findSub}
            </p>
            <input
              style={{ ...inputStyle, marginBottom: 10 }}
              placeholder={L.searchPh}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* v3.9 — ZIP radius selector: only shown when the search looks like a 5-digit ZIP */}
            {/^\d{5}$/.test(search.trim()) && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>{L.radiusLbl}</span>
                {[[0, L.radiusExact], [1, "1 mi"], [5, "5 mi"], [10, "10 mi"]].map(([mi, label]) => {
                  const active = radius === mi;
                  return (
                    <button
                      key={mi}
                      type="button"
                      onClick={() => setRadius(mi)}
                      style={{
                        padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700,
                        border: `1.5px solid ${active ? T.primary : T.line}`,
                        background: active ? T.primary : "#fff",
                        color: active ? "#fff" : T.ink,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "block", marginBottom: 4 }}>{L.maxRate}</span>
                <input style={inputStyle} inputMode="numeric" placeholder="e.g. 30" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} />
              </div>
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "block", marginBottom: 4 }}>{L.ageFrom}</span>
                <input style={inputStyle} inputMode="numeric" placeholder="e.g. 30" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
              </div>
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "block", marginBottom: 4 }}>{L.ageTo}</span>
                <input style={inputStyle} inputMode="numeric" placeholder="e.g. 60" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
              </div>
            </div>
            {(maxRate || minAge || maxAge || serviceFilter || search) && (
              <button
                type="button"
                onClick={() => { setSearch(""); setRadius(0); setServiceFilter(""); setMaxRate(""); setMinAge(""); setMaxAge(""); }}
                style={{
                  marginBottom: 10, padding: "8px 14px", borderRadius: 999,
                  border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft,
                  fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {L.clearFilters}
              </button>
            )}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 12 }}>
              <Chip label={L.allServices} active={!serviceFilter} onClick={() => setServiceFilter("")} />
              {SERVICES.map((s) => (
                <Chip key={s} label={ts(s)} active={serviceFilter === s} onClick={() => setServiceFilter(s)} />
              ))}
            </div>

            {loading ? (
              <p style={{ textAlign: "center", color: T.inkSoft, marginTop: 40 }}>{L.loadingAides}</p>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: 48 }}>
                <div style={{ fontSize: 44 }}>🤝</div>
                <h3 style={{ margin: "10px 0 6px", fontFamily: "Georgia, serif", fontSize: 21 }}>
                  {aides.length === 0 ? L.noAidesTitle : L.noMatchTitle}
                </h3>
                <p style={{ color: T.inkSoft, fontSize: 15, margin: 0 }}>
                  {aides.length === 0 ? L.noAidesSub : L.noMatchSub}
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 13.5, color: T.inkSoft, margin: "0 0 10px" }}>
                  {filtered.length} {L.availableSuffix}
                </p>
                {filtered.map((a) => (
                  <AideCard
                    key={a.id}
                    aide={a}
                    subscribed={subscribed || unlockedIds.includes(a.id)}
                    reviews={reviews.filter((r) => r.caregiver_id === a.id)}
                    onAddReview={addReview}
                    hires={hires.filter((h) => h.caregiver_id === a.id)}
                    onHire={addHire}
                    hireDefault={account?.name || ""}
                    onRequireSub={() => { setPendingUnlock(a.id); setView("plans"); window.scrollTo(0, 0); }}
                    onDelete={handleDelete}
                    onEdit={(rec) => { setEditing(rec); setView("register"); window.scrollTo(0, 0); }}
                    searchQueryId={lastSearchId}
                    memberSession={account}
                  />
                ))}
              </>
            )}

            {/* Medicaid teaser → agencies tab */}
            {agencies.length > 0 && (
              <button
                type="button"
                onClick={() => { setTab("agencies"); window.scrollTo(0, 0); }}
                style={{ width: "100%", marginTop: 18, padding: "13px", borderRadius: 12, border: `1.5px solid ${T.primary}`, background: "#F3F7F5", color: T.primary, fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit" }}
              >
                {L.medicaidTeaser} →
              </button>
            )}
            </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.line}`, padding: "20px 16px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14 }}>
          <button
            type="button"
            onClick={() => { setView("faq"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
          >
            {L.faqLink}
          </button>
          <span style={{ color: T.inkSoft }}>·</span>
          <button
            type="button"
            onClick={() => { setView("privacy"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
          >
            {L.fPrivacy}
          </button>
          <span style={{ color: T.inkSoft }}>·</span>
          <button
            type="button"
            onClick={() => { setView("terms"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
          >
            {L.fTerms}
          </button>

          <span style={{ color: T.inkSoft }}>·</span>
          <button
            type="button"
            onClick={() => { setView("admin"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.inkSoft, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Admin
            {pendingCount > 0 && (
              <span
                title={`${pendingCount} caregiver${pendingCount === 1 ? "" : "s"} awaiting review`}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  minWidth: 20, height: 20, padding: "0 6px",
                  borderRadius: 999, background: T.danger, color: "#fff",
                  fontSize: 11.5, fontWeight: 800, lineHeight: 1,
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12.5, color: T.inkSoft }}>
          {L.fCopy} · {APP_VERSION}
        </p>
      </footer>

      {toast && (
        <div
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: T.ink, color: "#fff", padding: "12px 20px", borderRadius: 999,
            fontSize: 15, fontWeight: 600, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
