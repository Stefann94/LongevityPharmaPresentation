-- =============================================================================
--  URGENT — RESTAURAREA PRETURILOR IN BAZA ROMANEASCA
-- =============================================================================
--  CE S-A INTAMPLAT
--  Scriptul de conversie RON -> EUR (en-03-preturi-eur.sql) a rulat pe baza
--  romaneasca, nu pe cea engleza. Cele 110 preturi au fost impartite la 5.25 si
--  rotunjite in sus la .90, deci site-ul longevitypharma.ro afiseaza preturi de
--  circa cinci ori mai mici decat cele reale.
--
--  CE FACE FISIERUL
--  Pune la loc pretul exact al fiecarui produs, dupa id.
--
--  Valorile provin din baza engleza, populata INAINTE de conversie, si au fost
--  verificate una cate una cu extragerea completa facuta la inceputul lucrarii.
--  Toate cele 110 se potrivesc.
--
--  NU este o inmultire inapoi cu 5.25. Rotunjirea la .90 a pierdut informatie:
--  110 impartit la 5.25 da 20.95, rotunjit la 21.90, iar 21.90 inmultit cu 5.25
--  da 114.97 - nu 110. De aceea fiecare pret este scris individual.
--
--  Totul ruleaza intr-o singura tranzactie: ori se aplica toate cele 110
--  actualizari, ori niciuna.
--
--  DE RULAT: in proiectul LongevityFarma — cel ROMANESC.
--  Verifica sus, in bara Supabase, inainte de a apasa Run.
-- =============================================================================

begin;

update public.products set price = 50.00 where id = '2f1120d0-6df0-4c21-808f-f82ce77cb85f';
update public.products set price = 65.00 where id = 'd004941b-e555-433e-8ea7-250399286033';
update public.products set price = 65.00 where id = 'd4aa35a3-3928-4cc3-9147-75cb240a0913';
update public.products set price = 40.00 where id = '8967adc3-c983-4394-be94-d6319d3f441f';
update public.products set price = 110.00 where id = '6bb0904c-5499-4c77-a831-44b14190d575';
update public.products set price = 75.00 where id = 'e604aa5b-8831-4ac0-adf2-e3f1c94ed2d7';
update public.products set price = 80.00 where id = 'a4c31ca9-683e-4170-9f91-7cd71bc1bf49';
update public.products set price = 75.00 where id = '2873005f-b0e6-4cd4-adef-871e425c5709';
update public.products set price = 95.00 where id = '73ffa516-a754-43c0-945e-ecb471bc9e3c';
update public.products set price = 68.00 where id = '41696a56-0426-4786-a67b-e1ded0dff2ce';
update public.products set price = 55.00 where id = '870a04e4-aac8-41c7-9bc5-6f78e4dc309d';
update public.products set price = 75.00 where id = 'c117e5dc-2b57-435c-8a7a-3495697aa432';
update public.products set price = 50.00 where id = '628a3077-d9ec-4425-b50e-8a9dcfa09b2c';
update public.products set price = 50.00 where id = 'b77d523d-8677-4485-835e-a0913f6947bb';
update public.products set price = 30.00 where id = 'b2863e60-a771-4c84-94b9-d6306f59ef00';
update public.products set price = 45.00 where id = 'aa048e77-f508-446d-9246-375eb13f3cbd';
update public.products set price = 85.00 where id = '49574dee-c560-4247-9864-8b0256fe9f32';
update public.products set price = 105.00 where id = 'bf9ccd48-e039-477f-8300-5a5b41aaa69d';
update public.products set price = 120.00 where id = '83e1c018-142b-44eb-9f95-14c4dfdebbfc';
update public.products set price = 165.00 where id = '7befa0fc-f3b9-4dac-849f-ee69de15b96c';
update public.products set price = 95.00 where id = '5ccae9da-7af3-4248-ad57-56556b9db1fe';
update public.products set price = 60.00 where id = 'ab3ea017-1625-4623-9b7b-0385c529d12a';
update public.products set price = 65.00 where id = 'ad2fe80e-abd5-46eb-9562-ccac5f1f1a25';
update public.products set price = 140.00 where id = '9dbd886d-0907-4b23-b7d2-0f3ff012649b';
update public.products set price = 120.00 where id = '169136a0-369d-4113-b23d-445671edbdf0';
update public.products set price = 105.00 where id = 'c3325ef3-03ef-4dd7-bc86-d19e8e405262';
update public.products set price = 95.00 where id = '5e91a66c-066a-43b4-aae8-762d9cf6b3c5';
update public.products set price = 90.00 where id = 'a0df56da-b536-47c3-836c-ab2aebd56daf';
update public.products set price = 40.00 where id = 'd7bbe1d2-8ef2-44d5-9483-0e66aead4120';
update public.products set price = 40.00 where id = 'c391a6c8-9eeb-4dd3-8a42-408c355a9001';
update public.products set price = 65.00 where id = 'c34668cc-afc7-4c48-ade8-d41030431c91';
update public.products set price = 95.00 where id = '9a1ba2cd-baaf-48dd-8c1b-2b54da4f4055';
update public.products set price = 55.00 where id = '33b80280-b589-4d25-ac69-31403ee2f362';
update public.products set price = 35.00 where id = '4b5f3e66-fa33-498a-962b-fba275e4c3a4';
update public.products set price = 89.90 where id = 'ed289ece-a67f-4cc2-b5e8-f81d5c1c29c3';
update public.products set price = 90.00 where id = '9d12ff61-5d48-496b-b211-f51358972299';
update public.products set price = 75.00 where id = 'debbac4c-17cf-4702-95a3-9f33c47c9148';
update public.products set price = 155.00 where id = 'c6f36bc2-623c-42f4-95fe-95a6c22c29c2';
update public.products set price = 40.00 where id = 'cea8cd2a-40f5-4bb9-89ac-e73f76499353';
update public.products set price = 60.00 where id = 'd51a9642-e960-4673-b5fb-6960ee8144b3';
update public.products set price = 150.00 where id = '75ba1e2e-6ecb-4847-a75f-5404c17138b7';
update public.products set price = 130.00 where id = '913a9be2-b9df-4461-926f-52c371788f59';
update public.products set price = 70.00 where id = '57d7703f-1962-417d-ac61-6ba4e87e95cd';
update public.products set price = 85.00 where id = '84c326a9-a10a-4d0d-97f4-b0837f0e2296';
update public.products set price = 45.00 where id = '238fe37c-7c2e-4d3d-baf4-60bf6a21964e';
update public.products set price = 85.00 where id = '4ce342bc-78a3-44b9-be3b-d5fa39f8c5a6';
update public.products set price = 55.00 where id = 'aceb4745-5481-4481-95f1-c9c99aa93b18';
update public.products set price = 75.00 where id = '0b5a2b3e-9b7e-48df-96bf-eede56b9dbbb';
update public.products set price = 140.00 where id = '3b2388b0-3492-4f30-93dd-a19bbe444790';
update public.products set price = 50.00 where id = 'e31e3e6c-8953-43c1-af45-9e7e7b80d4a8';
update public.products set price = 45.00 where id = 'c129c50a-d199-4d88-ad11-258cad751b55';
update public.products set price = 42.00 where id = 'e1f6d5d1-d47d-4011-8011-596ca5d3a7d9';
update public.products set price = 30.00 where id = '139456eb-3285-4589-9469-9f6df70cb715';
update public.products set price = 45.00 where id = '6da8548a-bcf2-4b97-b3ac-941573a4e00c';
update public.products set price = 90.00 where id = '94bb843e-c994-403b-a2f2-45cc5285b0e8';
update public.products set price = 135.00 where id = 'c3a941dc-1a94-4344-bb6f-755801625aa6';
update public.products set price = 45.00 where id = 'c20de2e7-7bb2-478f-ad72-9dc6b878a872';
update public.products set price = 210.00 where id = 'f2a6a3d3-feaa-4137-834f-5988f9a8a66a';
update public.products set price = 250.00 where id = '2ea4b3d2-7882-4871-8dd6-ffd37bb9ff06';
update public.products set price = 85.00 where id = 'e0edf608-d21b-459d-b16d-cb3592b383d4';
update public.products set price = 110.00 where id = '7eaa6a02-774c-4a89-aa69-91f89cdd4b9a';
update public.products set price = 145.00 where id = '8d23801d-8cf5-411a-9302-0a66b83d484f';
update public.products set price = 189.99 where id = 'af2c0aa0-9a25-4e8b-a003-70876b266cc7';
update public.products set price = 210.50 where id = '85ded015-86a1-49ac-8eae-7d012258e9a3';
update public.products set price = 190.00 where id = '4e01d13c-a8d2-408b-b1f8-a9ef072c7560';
update public.products set price = 55.00 where id = 'f4a827c1-7d94-4bc1-8e92-7b72399e3456';
update public.products set price = 75.00 where id = 'f5fcb234-3a6b-426e-8134-19767988c2f3';
update public.products set price = 85.00 where id = '8a9f2853-e73a-47e3-94c2-a55b289f2e6d';
update public.products set price = 110.00 where id = 'bb8181ab-19ea-4f30-a29c-2d77c0b1e134';
update public.products set price = 60.00 where id = '3bd66e63-cde3-4942-b405-159e04d8fd8a';
update public.products set price = 245.00 where id = 'e257f4dc-8b97-4a5f-8eaf-c6f6c04a6f4b';
update public.products set price = 275.00 where id = '24c3dc75-6922-47c2-be45-1ff4860c0974';
update public.products set price = 350.00 where id = 'a3ef67bd-bc81-4896-9244-c0b6ee59c3eb';
update public.products set price = 190.00 where id = 'e35b2be3-fc29-4f0d-b117-ebcf64c370fb';
update public.products set price = 160.00 where id = '48fad123-8f67-4c03-9b79-9c04a09d5542';
update public.products set price = 45.00 where id = 'c541e8ef-1f5f-44b5-af74-a9ab9adf312b';
update public.products set price = 95.00 where id = '03df53be-571d-4c1b-ae79-3124dc794565';
update public.products set price = 105.00 where id = 'adb52ad8-899a-4448-b11d-d0006082821a';
update public.products set price = 130.00 where id = '167e6b47-9b50-44b7-81b2-16603b5a2a00';
update public.products set price = 320.00 where id = '4b94306d-5832-4407-8881-4c8ab446f3c6';
update public.products set price = 285.50 where id = 'b1285661-ef41-468a-bca4-a9de99bdc3fe';
update public.products set price = 299.99 where id = 'efdeac53-614e-486f-b563-2924af6e61ef';
update public.products set price = 110.00 where id = '3bb19c3d-36f2-453e-b041-8b0ec31bd30e';
update public.products set price = 75.00 where id = 'b7afc5e3-3a3a-47f1-aafa-68a7fd97d013';
update public.products set price = 89.90 where id = 'db03e7a0-de49-4e5f-ab0b-f0ffad5a0300';
update public.products set price = 110.00 where id = 'cdf1cd23-36e5-4f74-bcdd-7bce788b7f09';
update public.products set price = 110.00 where id = '6c742d01-9d90-4de2-9fb7-9e38137cb7f7';
update public.products set price = 139.99 where id = 'b3967136-cf6c-4f5f-a1ab-e02dc3b151ee';
update public.products set price = 125.50 where id = 'a9b1f5da-c54b-4590-91f8-631ea19986e5';
update public.products set price = 145.00 where id = 'ac7127f6-0f9d-4aec-8fd1-fad4349d83d7';
update public.products set price = 65.00 where id = '3b3d129a-9cfb-4199-80b6-a2863b94dd82';
update public.products set price = 65.00 where id = '93728854-2bd9-401f-8f91-1d1330af3431';
update public.products set price = 55.00 where id = 'bd627d60-d04a-4c0c-8ad5-8090b3ca8f7f';
update public.products set price = 55.00 where id = '3b84b29b-8fee-4aae-bf92-bd3c33d38a99';
update public.products set price = 35.00 where id = '9dd10611-8168-425b-bb5c-a220e5549f83';
update public.products set price = 140.00 where id = '17d8cd89-fce6-49eb-a260-d6dfea5317aa';
update public.products set price = 65.00 where id = 'ed82f0f6-a9ab-410d-b96e-b862ef3d1d3c';
update public.products set price = 120.00 where id = '2f71ca14-525d-4ef7-85c5-19be832a554b';
update public.products set price = 180.00 where id = '0c9fd816-e8c7-4b2f-a6ac-cc508eb11cc3';
update public.products set price = 170.00 where id = '95a314cc-5029-4958-a75f-989524fc93e4';
update public.products set price = 65.00 where id = 'da7330d1-975c-4e15-b760-60cd2200165e';
update public.products set price = 60.00 where id = '4dc4a8ab-25e5-4a51-897e-47b3e2b2909e';
update public.products set price = 40.00 where id = 'bdf59bfb-1e91-45b9-90c4-1ca02354948b';
update public.products set price = 85.00 where id = '7d6d944f-b56d-49b5-b8bd-5e1fceb5ca03';
update public.products set price = 55.00 where id = 'df4590d9-2477-4e96-9602-7549e160bcb4';
update public.products set price = 80.00 where id = '3f004c19-13da-4315-83db-f8172812647f';
update public.products set price = 85.00 where id = '1b572cb8-6647-4ef4-bd30-5d2ba29cb6ed';
update public.products set price = 55.00 where id = '8a89d2f7-285a-4b8e-af04-ad97c84af1f8';
update public.products set price = 60.00 where id = 'e817375d-5f36-46fe-bc37-505c9d83decc';
update public.products set price = 45.00 where id = '207fb438-0511-4bfd-a098-03178ae2af65';

-- Scoatem si evidenta conversiei, care nu are ce cauta in baza romaneasca.
delete from public.conversii_moneda where id = 'ron_to_eur';

commit;


-- -----------------------------------------------------------------------------
-- VERIFICARE — ruleaza dupa
-- -----------------------------------------------------------------------------
-- Intervalul trebuie sa fie 30.00 - 350.00, nu 5.90 - 66.90.
select min(price) as minim, max(price) as maxim, count(*) as produse
  from public.products;

-- Control punctual: alpha-gpc trebuie sa fie 110.00
select slug, price from public.products where slug = 'alpha-gpc';
