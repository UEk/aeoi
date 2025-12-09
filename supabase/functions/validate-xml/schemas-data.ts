export const SCHEMAS = {
  'CommonTypesFatcaCrs_v2.0.xsd': `
<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSpy v2012 rel. 2 sp1 (x64) (http://www.altova.com) by Sebastien Michon (OECD) -->
<xsd:schema xmlns:cfc="urn:oecd:ties:commontypesfatcacrs:v2" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:stf="urn:oecd:ties:crsstf:v5" xmlns:iso="urn:oecd:ties:isocrstypes:v1" targetNamespace="urn:oecd:ties:commontypesfatcacrs:v2" elementFormDefault="qualified" attributeFormDefault="unqualified" version="2.0">
	<xsd:import namespace="urn:oecd:ties:isocrstypes:v1" schemaLocation="isocrstypes_v1.1.xsd"/>
	<xsd:import namespace="urn:oecd:ties:crsstf:v5" schemaLocation="oecdcrstypes_v5.0.xsd"/>
	<!--+++++++++++++++++++++++  Reusable Simple types ++++++++++++++++++++++++++++++++++++++ -->
	<!-- -->
	<!-- Data type for any kind of numeric data with two decimal fraction digits, especially monetary amounts -->
	<xsd:simpleType name="TwoDigFract_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">
				Data type for any kind of numeric data with two decimal fraction digits, especially monetary amounts.
			</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:decimal">
			<xsd:fractionDigits value="2"/>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!-- Account Number Type - 6 -->
	<xsd:simpleType name="AcctNumberType_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Account Number Type</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="OECD601">
				<xsd:annotation>
					<xsd:documentation>IBAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD602">
				<xsd:annotation>
					<xsd:documentation>OBAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD603">
				<xsd:annotation>
					<xsd:documentation>ISIN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD604">
				<xsd:annotation>
					<xsd:documentation>OSIN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD605">
				<xsd:annotation>
					<xsd:documentation>Other</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!--  -->
	<!--++++++++++++++++++ Reusable Complex types +++++++++++++++++++++++++++++++++++++ -->
	<!-- -->
	<!-- Address Fix -->
	<xsd:complexType name="AddressFix_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">
			Structure of the address for a party broken down into its logical parts, recommended for easy matching. The 'City' element is the only required subelement. All of the subelements are simple text - data type 'string'.
			</xsd:documentation>
		</xsd:annotation>
		<xsd:sequence>
			<xsd:element name="Street" type="stf:StringMin1Max200_Type" minOccurs="0"/>
			<xsd:element name="BuildingIdentifier" type="stf:StringMin1Max200_Type" minOccurs="0"/>
			<xsd:element name="SuiteIdentifier" type="stf:StringMin1Max200_Type" minOccurs="0"/>
			<xsd:element name="FloorIdentifier" type="stf:StringMin1Max200_Type" minOccurs="0"/>
			<xsd:element name="DistrictName" type="stf:StringMin1Max200_Type" minOccurs="0"/>
			<xsd:element name="POB" type="stf:StringMin1Max200_Type" minOccurs="0"/>
			<xsd:element name="PostCode" type="stf:StringMin1Max200_Type" minOccurs="0"/>
			<xsd:element name="City" type="stf:StringMin1Max200_Type"/>
			<xsd:element name="CountrySubentity" type="stf:StringMin1Max200_Type" minOccurs="0"/>
		</xsd:sequence>
	</xsd:complexType>
	<!--  -->
	<!--  The Address of a Party, given in fixed or free Form, possibly in both Forms -->
	<xsd:complexType name="Address_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">
			The user has the option to enter the data about the address of a party either as one long field or to spread the data over up to eight  elements or even to use both formats. If the user chooses the option to enter the data required in separate elements, the container element for this will be 'AddressFix'. If the user chooses the option to enter the data required in a less structured way in 'AddressFree' all available address details shall be presented as one string of bytes, blank or "/" (slash) or carriage return- line feed used as a delimiter between parts of the address. PLEASE NOTE that the address country code is outside  both of these elements. The use of the fixed form is recommended as a rule to allow easy matching. However, the use of the free form is recommended if the sending state cannot reliably identify and distinguish the different parts of the address. The user may want to use both formats e.g. if besides separating the logical parts of the address he also wants to indicate a suitable breakdown into print-lines by delimiters in the free text form. In this case 'AddressFix' has to precede 'AddressFree'.
			</xsd:documentation>
		</xsd:annotation>
		<xsd:sequence>
			<xsd:element name="CountryCode" type="iso:CountryCode_Type"/>
			<xsd:choice>
				<xsd:element name="AddressFree" type="stf:StringMin1Max4000_Type"/>
				<xsd:sequence>
					<xsd:element name="AddressFix" type="cfc:AddressFix_Type"/>
					<xsd:element name="AddressFree" type="stf:StringMin1Max4000_Type" minOccurs="0"/>
				</xsd:sequence>
			</xsd:choice>
		</xsd:sequence>
		<xsd:attribute name="legalAddressType" type="stf:OECDLegalAddressType_EnumType" use="optional"/>
	</xsd:complexType>
	<!--  -->
	<!-- General Type for Monetary Amounts -->
	<xsd:complexType name="MonAmnt_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">
This data type is to be used whenever monetary amounts are to be communicated. Such amounts shall be given
including two fractional digits of the main currency unit. The code for the currency in which the value is expressed has to be
taken from the ISO codelist 4217 and added in attribute currCode.
</xsd:documentation>
		</xsd:annotation>
		<xsd:simpleContent>
			<xsd:extension base="cfc:TwoDigFract_Type">
				<xsd:attribute name="currCode" type="iso:currCode_Type" use="required"/>
			</xsd:extension>
		</xsd:simpleContent>
	</xsd:complexType>
	<!--  -->
	<!-- Organisation name -->
	<xsd:complexType name="NameOrganisation_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Name of organisation</xsd:documentation>
		</xsd:annotation>
		<xsd:simpleContent>
			<xsd:extension base="stf:StringMin1Max200_Type">
				<xsd:attribute name="nameType" type="stf:OECDNameType_EnumType" use="optional"/>
			</xsd:extension>
		</xsd:simpleContent>
	</xsd:complexType>
	<!-- -->
	<!-- TIN -->
	<xsd:complexType name="TIN_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">This is the identification number/identification code for the party in question. As the identifier may be not strictly numeric, it is just defined as a string of characters. Attribute 'issuedBy' is required to designate the issuer of the identifier. </xsd:documentation>
		</xsd:annotation>
		<xsd:simpleContent>
			<xsd:extension base="stf:StringMin1Max200_Type">
				<xsd:attribute name="issuedBy" type="iso:CountryCode_Type" use="optional">
					<xsd:annotation>
						<xsd:documentation xml:lang="en">Country code of issuing country, indicating country of Residence (to taxes and other)</xsd:documentation>
					</xsd:annotation>
				</xsd:attribute>
			</xsd:extension>
		</xsd:simpleContent>
	</xsd:complexType>
	<!-- -->
</xsd:schema>
`,
  'CrsXML_v2.0.xsd': `
<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSpy v2012 rel. 2 sp1 (x64) (http://www.altova.com) by Sebastien Michon (OECD) -->
<xsd:schema xmlns:crs="urn:oecd:ties:crs:v2" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:ftc="urn:oecd:ties:fatca:v1" xmlns:cfc="urn:oecd:ties:commontypesfatcacrs:v2" xmlns:stf="urn:oecd:ties:crsstf:v5" xmlns:iso="urn:oecd:ties:isocrstypes:v1" targetNamespace="urn:oecd:ties:crs:v2" elementFormDefault="qualified" attributeFormDefault="unqualified" version="2.0">
	<xsd:import namespace="urn:oecd:ties:isocrstypes:v1" schemaLocation="isocrstypes_v1.1.xsd"/>
	<xsd:import namespace="urn:oecd:ties:crsstf:v5" schemaLocation="oecdcrstypes_v5.0.xsd"/>
	<xsd:import namespace="urn:oecd:ties:commontypesfatcacrs:v2" schemaLocation="CommonTypesFatcaCrs_v2.0.xsd"/>
	<xsd:import namespace="urn:oecd:ties:fatca:v1" schemaLocation="FatcaTypes_v1.2.xsd"/>
	<!--+++++++++++++++++++++++  Reusable Simple types ++++++++++++++++++++++++++++++++++++++ -->
	<!-- Message type definitions -->
	<xsd:simpleType name="MessageType_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Message type defines the type of reporting </xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="CRS"/>
		</xsd:restriction>
	</xsd:simpleType>
	<!--  -->
	<!-- Account Holder Type - 1 -->
	<xsd:simpleType name="CrsAcctHolderType_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Account Holder Type</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="CRS101">
				<xsd:annotation>
					<xsd:documentation>Passive Non-Financial Entity with one or more controlling person that is a Reportable Person</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS102">
				<xsd:annotation>
					<xsd:documentation>CRS Reportable Person</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS103">
				<xsd:annotation>
					<xsd:documentation>Passive NFE that is a CRS Reportable Person</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!--  -->
	<!-- CRS Payment Type - 5 -->
	<xsd:simpleType name="CrsPaymentType_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">The code describing the nature of the payments used in CRS
			</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="CRS501">
				<xsd:annotation>
					<xsd:documentation>Dividends</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS502">
				<xsd:annotation>
					<xsd:documentation>Interest</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS503">
				<xsd:annotation>
					<xsd:documentation>Gross Proceeds/Redemptions</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS504">
				<xsd:annotation>
					<xsd:documentation>Other - CRS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!--  -->
	<!-- MessageTypeIndic - 7 -->
	<xsd:simpleType name="CrsMessageTypeIndic_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">The MessageTypeIndic defines the type of message sent</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="CRS701">
				<xsd:annotation>
					<xsd:documentation>The message contains new information</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS702">
				<xsd:annotation>
					<xsd:documentation>The message contains corrections for previously sent information</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS703">
				<xsd:annotation>
					<xsd:documentation>The message advises there is no data to report</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!--  -->
	<!-- Controlling Person Type - 8 -->
	<xsd:simpleType name="CrsCtrlgPersonType_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Controlling Person Type</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="CRS801">
				<xsd:annotation>
					<xsd:documentation>CP of legal person - ownership</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS802">
				<xsd:annotation>
					<xsd:documentation>CP of legal person - other means</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS803">
				<xsd:annotation>
					<xsd:documentation>CP of legal person - senior managing official</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS804">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - trust - settlor</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS805">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - trust - trustee</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS806">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - trust - protector</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS807">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - trust - beneficiary</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS808">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - trust - other</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS809">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - other - settlor-equivalent</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS810">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - other - trustee-equivalent</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS811">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - other - protector-equivalent</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS812">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - other - beneficiary-equivalent</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRS813">
				<xsd:annotation>
					<xsd:documentation>CP of legal arrangement - other - other-equivalent</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!--  -->
	<!--++++++++++++++++++ Reusable Complex types +++++++++++++++++++++++++++++++++++++ -->
	<!-- Message specification: Data identifying and describing the message as a whole -->
	<xsd:complexType name="MessageSpec_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Information in the message header identifies the Tax Administration that is sending the message.  It specifies when the message was created, what period (normally a year) the report is for, and the nature of the report (original, corrected, supplemental, etc).</xsd:documentation>
		</xsd:annotation>
		<xsd:sequence>
			<xsd:element name="SendingCompanyIN" type="stf:StringMin1Max200_Type" minOccurs="0"/>
			<xsd:element name="TransmittingCountry" type="iso:CountryCode_Type"/>
			<xsd:element name="ReceivingCountry" type="iso:CountryCode_Type"/>
			<!-- modified for CRS  -->
			<xsd:element name="MessageType" type="crs:MessageType_EnumType"/>
			<xsd:element name="Warning" type="stf:StringMin1Max4000_Type" minOccurs="0">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Free text expressing the restrictions for use of the information this
message contains and the legal framework under which it is given</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="Contact" type="stf:StringMin1Max4000_Type" minOccurs="0">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">All necessary contact information about persons responsible for and
involved in the processing of the data transmitted in this message, both legally and technically. Free text as this is not
intended for automatic processing. </xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="MessageRefId" type="stf:StringMin1Max170_Type">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Sender's unique identifier for this message</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="MessageTypeIndic" type="crs:CrsMessageTypeIndic_EnumType"/>
			<xsd:element name="CorrMessageRefId" type="stf:StringMin1Max170_Type" minOccurs="0" maxOccurs="unbounded">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Sender's unique identifier that has to be corrected.  Must point to 1 or more previous message</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="ReportingPeriod" type="xsd:date">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">The reporting year for which information is transmitted in documents of
the current message.</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="Timestamp" type="xsd:dateTime"/>
		</xsd:sequence>
	</xsd:complexType>
	<!-- -->
	<!-- Account Holder Type -->
	<xsd:complexType name="AccountHolder_Type">
		<xsd:sequence>
			<xsd:choice>
				<xsd:element name="Individual" type="crs:PersonParty_Type"/>
				<xsd:sequence>
					<xsd:element name="Organisation" type="crs:OrganisationParty_Type"/>
					<xsd:element name="AcctHolderType" type="crs:CrsAcctHolderType_EnumType"/>
				</xsd:sequence>
			</xsd:choice>
		</xsd:sequence>
	</xsd:complexType>
	<!-- -->
	<!-- Controlling Person Type -->
	<xsd:complexType name="ControllingPerson_Type">
		<xsd:sequence>
			<xsd:element name="Individual" type="crs:PersonParty_Type"/>
			<xsd:element name="CtrlgPersonType" type="crs:CrsCtrlgPersonType_EnumType" minOccurs="0"/>
		</xsd:sequence>
	</xsd:complexType>
	<!-- -->
	<!-- Account number -->
	<xsd:complexType name="FIAccountNumber_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Account number definition  </xsd:documentation>
		</xsd:annotation>
		<xsd:simpleContent>
			<xsd:extension base="stf:StringMin1Max200_Type">
				<xsd:attribute name="AcctNumberType" type="cfc:AcctNumberType_EnumType">
					<xsd:annotation>
						<xsd:documentation xml:lang="en">Account Number Type</xsd:documentation>
					</xsd:annotation>
				</xsd:attribute>
				<xsd:attribute name="UndocumentedAccount" type="xsd:boolean">
					<xsd:annotation>
						<xsd:documentation xml:lang="en">Undocumented Account</xsd:documentation>
					</xsd:annotation>
				</xsd:attribute>
				<xsd:attribute name="ClosedAccount" type="xsd:boolean">
					<xsd:annotation>
						<xsd:documentation xml:lang="en">Closed Account</xsd:documentation>
					</xsd:annotation>
				</xsd:attribute>
				<xsd:attribute name="DormantAccount" type="xsd:boolean">
					<xsd:annotation>
						<xsd:documentation xml:lang="en">Dormant Account</xsd:documentation>
					</xsd:annotation>
				</xsd:attribute>
			</xsd:extension>
		</xsd:simpleContent>
	</xsd:complexType>
	<!--  -->
	<!-- Correctable Account Report -->
	<xsd:complexType name="CorrectableAccountReport_Type">
		<xsd:sequence>
			<xsd:element name="DocSpec" type="stf:DocSpec_Type"/>
			<xsd:element name="AccountNumber" type="crs:FIAccountNumber_Type"/>
			<xsd:element name="AccountHolder" type="crs:AccountHolder_Type"/>
			<xsd:element name="ControllingPerson" type="crs:ControllingPerson_Type" minOccurs="0" maxOccurs="unbounded"/>
			<xsd:element name="AccountBalance" type="cfc:MonAmnt_Type"/>
			<xsd:element name="Payment" type="crs:Payment_Type" minOccurs="0" maxOccurs="unbounded"/>
		</xsd:sequence>
	</xsd:complexType>
	<!--  -->
	<!-- The Name of a Party, given in fixed Form-->
	<xsd:complexType name="NamePerson_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">The user must spread the data about the name of a party over up to six elements. The container element for this will be 'NameFix'. </xsd:documentation>
		</xsd:annotation>
		<xsd:sequence>
			<xsd:element name="PrecedingTitle" type="stf:StringMin1Max200_Type" minOccurs="0">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">His Excellency,Estate of the Late ...</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="Title" type="stf:StringMin1Max200_Type" minOccurs="0" maxOccurs="unbounded">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Greeting title. Example: Mr, Dr, Ms, Herr, etc. Can have multiple titles.</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="FirstName">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">FirstName of the person</xsd:documentation>
				</xsd:annotation>
				<xsd:complexType>
					<xsd:simpleContent>
						<xsd:extension base="stf:StringMin1Max200_Type">
							<xsd:attribute name="xnlNameType" type="stf:StringMin1Max200_Type">
								<xsd:annotation>
									<xsd:documentation xml:lang="en">Defines the name type of FirstName. Example: Given Name, Forename, Christian Name, Father's Name, etc. In some countries, FirstName could be a Family Name or a SurName. Use this attribute to define the type for this name.
									</xsd:documentation>
								</xsd:annotation>
							</xsd:attribute>
						</xsd:extension>
					</xsd:simpleContent>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="MiddleName" minOccurs="0" maxOccurs="unbounded">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Middle name (essential part of the name for many nationalities). Example: Sakthi in "Nivetha Sakthi Shantha". Can have multiple middle names.</xsd:documentation>
				</xsd:annotation>
				<xsd:complexType>
					<xsd:simpleContent>
						<xsd:extension base="stf:StringMin1Max200_Type">
							<xsd:attribute name="xnlNameType" type="stf:StringMin1Max200_Type">
								<xsd:annotation>
									<xsd:documentation xml:lang="en">Defines the name type of Middle Name. Example: First name, middle name, maiden name, father's name, given name, etc.
									</xsd:documentation>
								</xsd:annotation>
							</xsd:attribute>
						</xsd:extension>
					</xsd:simpleContent>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="NamePrefix" minOccurs="0">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">de, van, van de, von, etc. Example: Derick de Clarke</xsd:documentation>
				</xsd:annotation>
				<xsd:complexType>
					<xsd:simpleContent>
						<xsd:extension base="stf:StringMin1Max200_Type">
							<xsd:attribute name="xnlNameType" type="stf:StringMin1Max200_Type">
								<xsd:annotation>
									<xsd:documentation xml:lang="en">Defines the type of name associated with the NamePrefix. For example the type of name is LastName and this prefix is the prefix for this last name.
							</xsd:documentation>
								</xsd:annotation>
							</xsd:attribute>
						</xsd:extension>
					</xsd:simpleContent>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="LastName">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Represents the position of the name in a name string. Can be Given Name, Forename, Christian Name, Surname, Family Name, etc. Use the attribute "NameType" to define what type this name is.
In case of a company, this field can be used for the company name.</xsd:documentation>
				</xsd:annotation>
				<xsd:complexType>
					<xsd:simpleContent>
						<xsd:extension base="stf:StringMin1Max200_Type">
							<xsd:attribute name="xnlNameType" type="stf:StringMin1Max200_Type">
								<xsd:annotation>
									<xsd:documentation xml:lang="en">Defines the name type of LastName. Example: Father's name, Family name, Sur Name, Mother's Name, etc. In some countries, LastName could be the given name or first name.
									</xsd:documentation>
								</xsd:annotation>
							</xsd:attribute>
						</xsd:extension>
					</xsd:simpleContent>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="GenerationIdentifier" type="stf:StringMin1Max200_Type" minOccurs="0" maxOccurs="unbounded">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Jnr, Thr Third, III</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="Suffix" type="stf:StringMin1Max200_Type" minOccurs="0" maxOccurs="unbounded">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Could be compressed initials - PhD, VC, QC</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="GeneralSuffix" type="stf:StringMin1Max200_Type" minOccurs="0">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Deceased, Retired ...</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
		</xsd:sequence>
		<xsd:attribute name="nameType" type="stf:OECDNameType_EnumType" use="optional"/>
	</xsd:complexType>
	<!-- -->
	<!-- Collection of all Data describing a person as a  Party -->
	<xsd:complexType name="PersonParty_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">
This container brings together all data about a person as a party. Name and address are required components and each can
be present more than once to enable as complete a description as possible. Whenever possible one or more identifiers (TIN
etc) should be added as well as a residence country code. Additional data that describes and identifies the party can be
given. The code for the legal type according to the OECD codelist must be added. The structures of
all of the subelements are defined elsewhere in this schema.</xsd:documentation>
		</xsd:annotation>
		<xsd:sequence>
			<xsd:element name="ResCountryCode" type="iso:CountryCode_Type" maxOccurs="unbounded"/>
			<xsd:element name="TIN" type="cfc:TIN_Type" minOccurs="0" maxOccurs="unbounded"/>
			<xsd:element name="Name" type="crs:NamePerson_Type" maxOccurs="unbounded"/>
			<xsd:element name="Address" type="cfc:Address_Type" maxOccurs="unbounded"/>
			<xsd:element name="Nationality" type="iso:CountryCode_Type" minOccurs="0" maxOccurs="unbounded"/>
			<xsd:element name="BirthInfo" minOccurs="0">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="BirthDate" type="xsd:date" minOccurs="0"/>
						<xsd:element name="City" type="stf:StringMin1Max200_Type" minOccurs="0"/>
						<xsd:element name="CitySubentity" type="stf:StringMin1Max200_Type" minOccurs="0"/>
						<xsd:element name="CountryInfo" minOccurs="0">
							<xsd:complexType>
								<xsd:choice>
									<xsd:element name="CountryCode" type="iso:CountryCode_Type"/>
									<xsd:element name="FormerCountryName" type="stf:StringMin1Max200_Type"/>
								</xsd:choice>
							</xsd:complexType>
						</xsd:element>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
		</xsd:sequence>
	</xsd:complexType>
	<!-- -->
	<!-- Organisation Identification Number -->
	<xsd:complexType name="OrganisationIN_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">This is the identification number/identification code for the Entity in question. As the identifier may be not strictly numeric, it is just defined as a string of characters. Attribute 'issuedBy' is required to designate the issuer of the identifier.  Attribute 'INType' defines the type of identification number. </xsd:documentation>
		</xsd:annotation>
		<xsd:simpleContent>
			<xsd:extension base="stf:StringMin1Max200_Type">
				<xsd:attribute name="issuedBy" type="iso:CountryCode_Type" use="optional">
					<xsd:annotation>
						<xsd:documentation xml:lang="en">Country code of issuing country, indicating country of Residence (to taxes and other)</xsd:documentation>
					</xsd:annotation>
				</xsd:attribute>
				<xsd:attribute name="INType" type="stf:StringMin1Max200_Type" use="optional">
					<xsd:annotation>
						<xsd:documentation xml:lang="en">Identification Number Type</xsd:documentation>
					</xsd:annotation>
				</xsd:attribute>
			</xsd:extension>
		</xsd:simpleContent>
	</xsd:complexType>
	<!-- -->
	<!-- Collection of all Data describing an organisationy  as party-->
	<xsd:complexType name="OrganisationParty_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">
This container brings together all data about an organisation as a party. Name and address are required components and each can
be present more than once to enable as complete a description as possible. Whenever possible one or more identifiers (TIN
etc) should be added as well as a residence country code. Additional data that describes and identifies the party can be
given . The code for the legal type according to the OECD codelist must be added. The structures of
all of the subelements are defined elsewhere in this schema.</xsd:documentation>
		</xsd:annotation>
		<xsd:sequence>
			<xsd:element name="ResCountryCode" type="iso:CountryCode_Type" minOccurs="0" maxOccurs="unbounded"/>
			<xsd:element name="IN" type="crs:OrganisationIN_Type" minOccurs="0" maxOccurs="unbounded">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Entity Identification Number</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="Name" type="cfc:NameOrganisation_Type" maxOccurs="unbounded"/>
			<xsd:element name="Address" type="cfc:Address_Type" maxOccurs="unbounded"/>
		</xsd:sequence>
	</xsd:complexType>
	<!-- -->
	<!-- Correctable Organisation-->
	<xsd:complexType name="CorrectableOrganisationParty_Type">
		<xsd:complexContent>
			<xsd:extension base="crs:OrganisationParty_Type">
				<xsd:sequence>
					<xsd:element name="DocSpec" type="stf:DocSpec_Type"/>
				</xsd:sequence>
			</xsd:extension>
		</xsd:complexContent>
	</xsd:complexType>
	<!-- -->
	<!-- Payment   -->
	<xsd:complexType name="Payment_Type">
		<xsd:sequence>
			<xsd:element name="Type" type="crs:CrsPaymentType_EnumType">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Type of payment (interest, dividend,...)</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="PaymentAmnt" type="cfc:MonAmnt_Type">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">The amount of payment</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
		</xsd:sequence>
	</xsd:complexType>
	<!-- -->
	<!--  -->
	<!-- CRS Body Type - CRS Report  -->
	<xsd:complexType name="CrsBody_Type">
		<xsd:sequence>
			<xsd:element name="ReportingFI" type="crs:CorrectableOrganisationParty_Type">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Reporting financial institution</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="ReportingGroup" maxOccurs="unbounded">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">For CRS, only one ReportingGroup for each CrsBody is to be provided</xsd:documentation>
				</xsd:annotation>
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="Sponsor" type="crs:CorrectableOrganisationParty_Type" minOccurs="0"/>
						<xsd:element name="Intermediary" type="crs:CorrectableOrganisationParty_Type" minOccurs="0"/>
						<xsd:element name="AccountReport" type="crs:CorrectableAccountReport_Type" minOccurs="0" maxOccurs="unbounded"/>
						<xsd:element name="PoolReport" type="ftc:CorrectablePoolReport_Type" minOccurs="0" maxOccurs="unbounded"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
		</xsd:sequence>
	</xsd:complexType>
	<!--+++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Schema  element ++++++++++++++++++++++++++++++++++++++++++++ -->
	<!-- CrsOECD File Message structure  -->
	<!-- -->
	<!-- CRS Message structure  -->
	<xsd:element name="CRS_OECD">
		<xsd:complexType>
			<xsd:sequence>
				<xsd:element name="MessageSpec" type="crs:MessageSpec_Type"/>
				<xsd:element name="CrsBody" type="crs:CrsBody_Type" minOccurs="0" maxOccurs="unbounded"/>
			</xsd:sequence>
			<xsd:attribute name="version" type="stf:StringMin1Max10_Type">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">CRS Version</xsd:documentation>
				</xsd:annotation>
			</xsd:attribute>
		</xsd:complexType>
	</xsd:element>
	<!-- -->
</xsd:schema>
`,
  'FatcaTypes_v1.2.xsd': `
<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSpy v2012 rel. 2 sp1 (x64) (http://www.altova.com) by Sebastien Michon (OECD) -->
<xsd:schema xmlns:ftc="urn:oecd:ties:fatca:v1" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:cfc="urn:oecd:ties:commontypesfatcacrs:v2" xmlns:stf="urn:oecd:ties:crsstf:v5" xmlns:iso="urn:oecd:ties:isocrstypes:v1" targetNamespace="urn:oecd:ties:fatca:v1" elementFormDefault="qualified" attributeFormDefault="unqualified" version="1.2">
	<xsd:import namespace="urn:oecd:ties:isocrstypes:v1" schemaLocation="isocrstypes_v1.1.xsd"/>
	<xsd:import namespace="urn:oecd:ties:crsstf:v5" schemaLocation="oecdcrstypes_v5.0.xsd"/>
	<xsd:import namespace="urn:oecd:ties:commontypesfatcacrs:v2" schemaLocation="CommonTypesFatcaCrs_v2.0.xsd"/>
	<!--+++++++++++++++++++++++  Reusable Simple types ++++++++++++++++++++++++++++++++++++++ -->
	<!-- -->
	<!-- Pool Reporting for Recalcitrant and Dormant Accounts Type - 2 -->
	<xsd:simpleType name="FatcaAcctPoolReportType_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Account Pool Reporting Type</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="FATCA201">
				<xsd:annotation>
					<xsd:documentation>Recalcitrant account holders with US Indicia</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FATCA202">
				<xsd:annotation>
					<xsd:documentation>Recalcitrant account holders without US Indicia</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FATCA203">
				<xsd:annotation>
					<xsd:documentation>Dormant accounts</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FATCA204">
				<xsd:annotation>
					<xsd:documentation>Non-participating foreign financial institutions</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FATCA205">
				<xsd:annotation>
					<xsd:documentation>Recalcitrant account holders that are US persons</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FATCA206">
				<xsd:annotation>
					<xsd:documentation>Recalcitrant account holders that are passive NFFEs</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!--  -->
	<!-- Correctable Pool Report -->
	<xsd:complexType name="CorrectablePoolReport_Type">
		<xsd:sequence>
			<xsd:element name="DocSpec" type="stf:DocSpec_Type"/>
			<xsd:element name="AccountCount" type="xsd:integer"/>
			<xsd:element name="AccountPoolReportType" type="ftc:FatcaAcctPoolReportType_EnumType"/>
			<xsd:element name="PoolBalance" type="cfc:MonAmnt_Type"/>
		</xsd:sequence>
	</xsd:complexType>
	<!--  -->
</xsd:schema>
`,
  'isocrstypes_v1.1.xsd': `
<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSpy v2012 rel. 2 sp1 (x64) (http://www.altova.com) by Sebastien Michon (OECD) -->
<xsd:schema xmlns:iso="urn:oecd:ties:isocrstypes:v1" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:oecd:ties:isocrstypes:v1" elementFormDefault="qualified" attributeFormDefault="unqualified" version="1.1">
	<!--  ISO 3166 alpha 2 Country Code 

The following disclaimer refers to all uses of the ISO country code list in the CRS schema: For practical reasons, the list is based on the ISO 3166-1 country list which is currently used by banks and other financial institutions, and hence by tax administrations. The use of this list does not imply the expression by the OECD of any opinion whatsoever concerning the legal status of the territories listed. Its content is without prejudice to the status of or sovereignty over any territory, to the delimitation of international frontiers and boundaries and to the name of any territory, city or area.  
    -->
	<xsd:simpleType name="CountryCode_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">ISO-3166 Alpha 2 country codes</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="AF">
				<xsd:annotation>
					<xsd:documentation>AFGHANISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AX">
				<xsd:annotation>
					<xsd:documentation>ALAND ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AL">
				<xsd:annotation>
					<xsd:documentation>ALBANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DZ">
				<xsd:annotation>
					<xsd:documentation>ALGERIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AS">
				<xsd:annotation>
					<xsd:documentation>AMERICAN SAMOA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AD">
				<xsd:annotation>
					<xsd:documentation>ANDORRA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AO">
				<xsd:annotation>
					<xsd:documentation>ANGOLA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AI">
				<xsd:annotation>
					<xsd:documentation>ANGUILLA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AQ">
				<xsd:annotation>
					<xsd:documentation>ANTARCTICA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AG">
				<xsd:annotation>
					<xsd:documentation>ANTIGUA AND BARBUDA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AR">
				<xsd:annotation>
					<xsd:documentation>ARGENTINA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AM">
				<xsd:annotation>
					<xsd:documentation>ARMENIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AW">
				<xsd:annotation>
					<xsd:documentation>ARUBA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AU">
				<xsd:annotation>
					<xsd:documentation>AUSTRALIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AT">
				<xsd:annotation>
					<xsd:documentation>AUSTRIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AZ">
				<xsd:annotation>
					<xsd:documentation>AZERBAIJAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BS">
				<xsd:annotation>
					<xsd:documentation>BAHAMAS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BH">
				<xsd:annotation>
					<xsd:documentation>BAHRAIN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BD">
				<xsd:annotation>
					<xsd:documentation>BANGLADESH</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BB">
				<xsd:annotation>
					<xsd:documentation>BARBADOS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BY">
				<xsd:annotation>
					<xsd:documentation>BELARUS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BE">
				<xsd:annotation>
					<xsd:documentation>BELGIUM</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BZ">
				<xsd:annotation>
					<xsd:documentation>BELIZE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BJ">
				<xsd:annotation>
					<xsd:documentation>BENIN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BM">
				<xsd:annotation>
					<xsd:documentation>BERMUDA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BT">
				<xsd:annotation>
					<xsd:documentation>BHUTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BO">
				<xsd:annotation>
					<xsd:documentation>BOLIVIA, PLURINATIONAL STATE OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BQ">
				<xsd:annotation>
					<xsd:documentation>BONAIRE, SINT EUSTATIUS AND SABA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BA">
				<xsd:annotation>
					<xsd:documentation>BOSNIA AND HERZEGOVINA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BW">
				<xsd:annotation>
					<xsd:documentation>BOTSWANA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BV">
				<xsd:annotation>
					<xsd:documentation>BOUVET ISLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BR">
				<xsd:annotation>
					<xsd:documentation>BRAZIL</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IO">
				<xsd:annotation>
					<xsd:documentation>BRITISH INDIAN OCEAN TERRITORY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BN">
				<xsd:annotation>
					<xsd:documentation>BRUNEI DARUSSALAM</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BG">
				<xsd:annotation>
					<xsd:documentation>BULGARIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BF">
				<xsd:annotation>
					<xsd:documentation>BURKINA FASO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BI">
				<xsd:annotation>
					<xsd:documentation>BURUNDI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KH">
				<xsd:annotation>
					<xsd:documentation>CAMBODIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CM">
				<xsd:annotation>
					<xsd:documentation>CAMEROON</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CA">
				<xsd:annotation>
					<xsd:documentation>CANADA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CV">
				<xsd:annotation>
					<xsd:documentation>CABO VERDE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KY">
				<xsd:annotation>
					<xsd:documentation>CAYMAN ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CF">
				<xsd:annotation>
					<xsd:documentation>CENTRAL AFRICAN REPUBLIC</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TD">
				<xsd:annotation>
					<xsd:documentation>CHAD</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CL">
				<xsd:annotation>
					<xsd:documentation>CHILE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CN">
				<xsd:annotation>
					<xsd:documentation>CHINA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CX">
				<xsd:annotation>
					<xsd:documentation>CHRISTMAS ISLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CC">
				<xsd:annotation>
					<xsd:documentation>COCOS (KEELING) ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CO">
				<xsd:annotation>
					<xsd:documentation>COLOMBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KM">
				<xsd:annotation>
					<xsd:documentation>COMOROS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CG">
				<xsd:annotation>
					<xsd:documentation>CONGO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CD">
				<xsd:annotation>
					<xsd:documentation>CONGO, THE DEMOCRATIC REPUBLIC OF THE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CK">
				<xsd:annotation>
					<xsd:documentation>COOK ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CR">
				<xsd:annotation>
					<xsd:documentation>COSTA RICA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CI">
				<xsd:annotation>
					<xsd:documentation>COTE D'IVOIRE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HR">
				<xsd:annotation>
					<xsd:documentation>CROATIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CU">
				<xsd:annotation>
					<xsd:documentation>CUBA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CW">
				<xsd:annotation>
					<xsd:documentation>CURACAO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CY">
				<xsd:annotation>
					<xsd:documentation>CYPRUS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CZ">
				<xsd:annotation>
					<xsd:documentation>CZECHIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DK">
				<xsd:annotation>
					<xsd:documentation>DENMARK</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DJ">
				<xsd:annotation>
					<xsd:documentation>DJIBOUTI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DM">
				<xsd:annotation>
					<xsd:documentation>DOMINICA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DO">
				<xsd:annotation>
					<xsd:documentation>DOMINICAN REPUBLIC</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="EC">
				<xsd:annotation>
					<xsd:documentation>ECUADOR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="EG">
				<xsd:annotation>
					<xsd:documentation>EGYPT</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SV">
				<xsd:annotation>
					<xsd:documentation>EL SALVADOR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GQ">
				<xsd:annotation>
					<xsd:documentation>EQUATORIAL GUINEA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ER">
				<xsd:annotation>
					<xsd:documentation>ERITREA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="EE">
				<xsd:annotation>
					<xsd:documentation>ESTONIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ET">
				<xsd:annotation>
					<xsd:documentation>ETHIOPIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FK">
				<xsd:annotation>
					<xsd:documentation>FALKLAND ISLANDS (MALVINAS)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FO">
				<xsd:annotation>
					<xsd:documentation>FAROE ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FJ">
				<xsd:annotation>
					<xsd:documentation>FIJI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FI">
				<xsd:annotation>
					<xsd:documentation>FINLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FR">
				<xsd:annotation>
					<xsd:documentation>FRANCE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GF">
				<xsd:annotation>
					<xsd:documentation>FRENCH GUIANA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PF">
				<xsd:annotation>
					<xsd:documentation>FRENCH POLYNESIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TF">
				<xsd:annotation>
					<xsd:documentation>FRENCH SOUTHERN TERRITORIES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GA">
				<xsd:annotation>
					<xsd:documentation>GABON</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GM">
				<xsd:annotation>
					<xsd:documentation>GAMBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GE">
				<xsd:annotation>
					<xsd:documentation>GEORGIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DE">
				<xsd:annotation>
					<xsd:documentation>GERMANY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GH">
				<xsd:annotation>
					<xsd:documentation>GHANA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GI">
				<xsd:annotation>
					<xsd:documentation>GIBRALTAR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GR">
				<xsd:annotation>
					<xsd:documentation>GREECE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GL">
				<xsd:annotation>
					<xsd:documentation>GREENLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GD">
				<xsd:annotation>
					<xsd:documentation>GRENADA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GP">
				<xsd:annotation>
					<xsd:documentation>GUADELOUPE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GU">
				<xsd:annotation>
					<xsd:documentation>GUAM</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GT">
				<xsd:annotation>
					<xsd:documentation>GUATEMALA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GG">
				<xsd:annotation>
					<xsd:documentation>GUERNSEY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GN">
				<xsd:annotation>
					<xsd:documentation>GUINEA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GW">
				<xsd:annotation>
					<xsd:documentation>GUINEA-BISSAU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GY">
				<xsd:annotation>
					<xsd:documentation>GUYANA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HT">
				<xsd:annotation>
					<xsd:documentation>HAITI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HM">
				<xsd:annotation>
					<xsd:documentation>HEARD ISLAND AND MCDONALD ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VA">
				<xsd:annotation>
					<xsd:documentation>HOLY SEE (VATICAN CITY STATE)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HN">
				<xsd:annotation>
					<xsd:documentation>HONDURAS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HK">
				<xsd:annotation>
					<xsd:documentation>HONG KONG</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HU">
				<xsd:annotation>
					<xsd:documentation>HUNGARY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IS">
				<xsd:annotation>
					<xsd:documentation>ICELAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IN">
				<xsd:annotation>
					<xsd:documentation>INDIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ID">
				<xsd:annotation>
					<xsd:documentation>INDONESIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IR">
				<xsd:annotation>
					<xsd:documentation>IRAN, ISLAMIC REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IQ">
				<xsd:annotation>
					<xsd:documentation>IRAQ</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IE">
				<xsd:annotation>
					<xsd:documentation>IRELAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IM">
				<xsd:annotation>
					<xsd:documentation>ISLE OF MAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IL">
				<xsd:annotation>
					<xsd:documentation>ISRAEL</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IT">
				<xsd:annotation>
					<xsd:documentation>ITALY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="JM">
				<xsd:annotation>
					<xsd:documentation>JAMAICA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="JP">
				<xsd:annotation>
					<xsd:documentation>JAPAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="JE">
				<xsd:annotation>
					<xsd:documentation>JERSEY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="JO">
				<xsd:annotation>
					<xsd:documentation>JORDAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KZ">
				<xsd:annotation>
					<xsd:documentation>KAZAKHSTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KE">
				<xsd:annotation>
					<xsd:documentation>KENYA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KI">
				<xsd:annotation>
					<xsd:documentation>KIRIBATI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KP">
				<xsd:annotation>
					<xsd:documentation>KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KR">
				<xsd:annotation>
					<xsd:documentation>KOREA, REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KW">
				<xsd:annotation>
					<xsd:documentation>KUWAIT</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KG">
				<xsd:annotation>
					<xsd:documentation>KYRGYZSTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LA">
				<xsd:annotation>
					<xsd:documentation>LAO PEOPLE'S DEMOCRATIC REPUBLIC</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LV">
				<xsd:annotation>
					<xsd:documentation>LATVIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LB">
				<xsd:annotation>
					<xsd:documentation>LEBANON</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LS">
				<xsd:annotation>
					<xsd:documentation>LESOTHO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LR">
				<xsd:annotation>
					<xsd:documentation>LIBERIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LY">
				<xsd:annotation>
					<xsd:documentation>LIBYA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LI">
				<xsd:annotation>
					<xsd:documentation>LIECHTENSTEIN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LT">
				<xsd:annotation>
					<xsd:documentation>LITHUANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LU">
				<xsd:annotation>
					<xsd:documentation>LUXEMBOURG</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MO">
				<xsd:annotation>
					<xsd:documentation>MACAO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MK">
				<xsd:annotation>
					<xsd:documentation>NORTH MACEDONIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MG">
				<xsd:annotation>
					<xsd:documentation>MADAGASCAR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MW">
				<xsd:annotation>
					<xsd:documentation>MALAWI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MY">
				<xsd:annotation>
					<xsd:documentation>MALAYSIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MV">
				<xsd:annotation>
					<xsd:documentation>MALDIVES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ML">
				<xsd:annotation>
					<xsd:documentation>MALI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MT">
				<xsd:annotation>
					<xsd:documentation>MALTA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MH">
				<xsd:annotation>
					<xsd:documentation>MARSHALL ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MQ">
				<xsd:annotation>
					<xsd:documentation>MARTINIQUE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MR">
				<xsd:annotation>
					<xsd:documentation>MAURITANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MU">
				<xsd:annotation>
					<xsd:documentation>MAURITIUS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="YT">
				<xsd:annotation>
					<xsd:documentation>MAYOTTE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MX">
				<xsd:annotation>
					<xsd:documentation>MEXICO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FM">
				<xsd:annotation>
					<xsd:documentation>MICRONESIA, FEDERATED STATES OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MD">
				<xsd:annotation>
					<xsd:documentation>MOLDOVA, REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MC">
				<xsd:annotation>
					<xsd:documentation>MONACO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MN">
				<xsd:annotation>
					<xsd:documentation>MONGOLIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ME">
				<xsd:annotation>
					<xsd:documentation>MONTENEGRO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MS">
				<xsd:annotation>
					<xsd:documentation>MONTSERRAT</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MA">
				<xsd:annotation>
					<xsd:documentation>MOROCCO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MZ">
				<xsd:annotation>
					<xsd:documentation>MOZAMBIQUE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MM">
				<xsd:annotation>
					<xsd:documentation>MYANMAR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NA">
				<xsd:annotation>
					<xsd:documentation>NAMIBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NR">
				<xsd:annotation>
					<xsd:documentation>NAURU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NP">
				<xsd:annotation>
					<xsd:documentation>NEPAL</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NL">
				<xsd:annotation>
					<xsd:documentation>NETHERLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NC">
				<xsd:annotation>
					<xsd:documentation>NEW CALEDONIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NZ">
				<xsd:annotation>
					<xsd:documentation>NEW ZEALAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NI">
				<xsd:annotation>
					<xsd:documentation>NICARAGUA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NE">
				<xsd:annotation>
					<xsd:documentation>NIGER</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NG">
				<xsd:annotation>
					<xsd:documentation>NIGERIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NU">
				<xsd:annotation>
					<xsd:documentation>NIUE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NF">
				<xsd:annotation>
					<xsd:documentation>NORFOLK ISLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MP">
				<xsd:annotation>
					<xsd:documentation>NORTHERN MARIANA ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NO">
				<xsd:annotation>
					<xsd:documentation>NORWAY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OM">
				<xsd:annotation>
					<xsd:documentation>OMAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PK">
				<xsd:annotation>
					<xsd:documentation>PAKISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PW">
				<xsd:annotation>
					<xsd:documentation>PALAU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PS">
				<xsd:annotation>
					<xsd:documentation>PALESTINE, STATE OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PA">
				<xsd:annotation>
					<xsd:documentation>PANAMA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PG">
				<xsd:annotation>
					<xsd:documentation>PAPUA NEW GUINEA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PY">
				<xsd:annotation>
					<xsd:documentation>PARAGUAY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PE">
				<xsd:annotation>
					<xsd:documentation>PERU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PH">
				<xsd:annotation>
					<xsd:documentation>PHILIPPINES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PN">
				<xsd:annotation>
					<xsd:documentation>PITCAIRN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PL">
				<xsd:annotation>
					<xsd:documentation>POLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PT">
				<xsd:annotation>
					<xsd:documentation>PORTUGAL</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PR">
				<xsd:annotation>
					<xsd:documentation>PUERTO RICO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="QA">
				<xsd:annotation>
					<xsd:documentation>QATAR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RE">
				<xsd:annotation>
					<xsd:documentation>REUNION</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RO">
				<xsd:annotation>
					<xsd:documentation>ROMANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RU">
				<xsd:annotation>
					<xsd:documentation>RUSSIAN FEDERATION</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RW">
				<xsd:annotation>
					<xsd:documentation>RWANDA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BL">
				<xsd:annotation>
					<xsd:documentation>SAINT BARTHELEMY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SH">
				<xsd:annotation>
					<xsd:documentation>SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KN">
				<xsd:annotation>
					<xsd:documentation>SAINT KITTS AND NEVIS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LC">
				<xsd:annotation>
					<xsd:documentation>SAINT LUCIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MF">
				<xsd:annotation>
					<xsd:documentation>SAINT MARTIN (FRENCH PART)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PM">
				<xsd:annotation>
					<xsd:documentation>SAINT PIERRE AND MIQUELON</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VC">
				<xsd:annotation>
					<xsd:documentation>SAINT VINCENT AND THE GRENADINES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="WS">
				<xsd:annotation>
					<xsd:documentation>SAMOA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SM">
				<xsd:annotation>
					<xsd:documentation>SAN MARINO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ST">
				<xsd:annotation>
					<xsd:documentation>SAO TOME AND PRINCIPE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SA">
				<xsd:annotation>
					<xsd:documentation>SAUDI ARABIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SN">
				<xsd:annotation>
					<xsd:documentation>SENEGAL</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RS">
				<xsd:annotation>
					<xsd:documentation>SERBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SC">
				<xsd:annotation>
					<xsd:documentation>SEYCHELLES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SL">
				<xsd:annotation>
					<xsd:documentation>SIERRA LEONE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SG">
				<xsd:annotation>
					<xsd:documentation>SINGAPORE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SX">
				<xsd:annotation>
					<xsd:documentation>SINT MAARTEN (DUTCH PART)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SK">
				<xsd:annotation>
					<xsd:documentation>SLOVAKIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SI">
				<xsd:annotation>
					<xsd:documentation>SLOVENIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SB">
				<xsd:annotation>
					<xsd:documentation>SOLOMON ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SO">
				<xsd:annotation>
					<xsd:documentation>SOMALIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ZA">
				<xsd:annotation>
					<xsd:documentation>SOUTH AFRICA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GS">
				<xsd:annotation>
					<xsd:documentation>SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SS">
				<xsd:annotation>
					<xsd:documentation>SOUTH SUDAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ES">
				<xsd:annotation>
					<xsd:documentation>SPAIN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LK">
				<xsd:annotation>
					<xsd:documentation>SRI LANKA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SD">
				<xsd:annotation>
					<xsd:documentation>SUDAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SR">
				<xsd:annotation>
					<xsd:documentation>SURINAME</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SJ">
				<xsd:annotation>
					<xsd:documentation>SVALBARD AND JAN MAYEN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SZ">
				<xsd:annotation>
					<xsd:documentation>ESWATINI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SE">
				<xsd:annotation>
					<xsd:documentation>SWEDEN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CH">
				<xsd:annotation>
					<xsd:documentation>SWITZERLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SY">
				<xsd:annotation>
					<xsd:documentation>SYRIAN ARAB REPUBLIC</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TW">
				<xsd:annotation>
					<xsd:documentation>TAIWAN, PROVINCE OF CHINA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TJ">
				<xsd:annotation>
					<xsd:documentation>TAJIKISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TZ">
				<xsd:annotation>
					<xsd:documentation>TANZANIA, UNITED REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TH">
				<xsd:annotation>
					<xsd:documentation>THAILAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TL">
				<xsd:annotation>
					<xsd:documentation>TIMOR-LESTE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TG">
				<xsd:annotation>
					<xsd:documentation>TOGO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TK">
				<xsd:annotation>
					<xsd:documentation>TOKELAU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TO">
				<xsd:annotation>
					<xsd:documentation>TONGA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TT">
				<xsd:annotation>
					<xsd:documentation>TRINIDAD AND TOBAGO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TN">
				<xsd:annotation>
					<xsd:documentation>TUNISIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TR">
				<xsd:annotation>
					<xsd:documentation>TURKEY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TM">
				<xsd:annotation>
					<xsd:documentation>TURKMENISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TC">
				<xsd:annotation>
					<xsd:documentation>TURKS AND CAICOS ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TV">
				<xsd:annotation>
					<xsd:documentation>TUVALU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UG">
				<xsd:annotation>
					<xsd:documentation>UGANDA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UA">
				<xsd:annotation>
					<xsd:documentation>UKRAINE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AE">
				<xsd:annotation>
					<xsd:documentation>UNITED ARAB EMIRATES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GB">
				<xsd:annotation>
					<xsd:documentation>UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="US">
				<xsd:annotation>
					<xsd:documentation>UNITED STATES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UM">
				<xsd:annotation>
					<xsd:documentation>UNITED STATES MINOR OUTLYING ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UY">
				<xsd:annotation>
					<xsd:documentation>URUGUAY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UZ">
				<xsd:annotation>
					<xsd:documentation>UZBEKISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VU">
				<xsd:annotation>
					<xsd:documentation>VANUATU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VE">
				<xsd:annotation>
					<xsd:documentation>VENEZUELA, BOLIVARIAN REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VN">
				<xsd:annotation>
					<xsd:documentation>VIET NAM</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VG">
				<xsd:annotation>
					<xsd:documentation>VIRGIN ISLANDS, BRITISH</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VI">
				<xsd:annotation>
					<xsd:documentation>VIRGIN ISLANDS, U.S.</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="WF">
				<xsd:annotation>
					<xsd:documentation>WALLIS AND FUTUNA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="EH">
				<xsd:annotation>
					<xsd:documentation>WESTERN SAHARA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="YE">
				<xsd:annotation>
					<xsd:documentation>YEMEN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ZM">
				<xsd:annotation>
					<xsd:documentation>ZAMBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ZW">
				<xsd:annotation>
					<xsd:documentation>ZIMBABWE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XK">
				<xsd:annotation>
					<xsd:documentation>KOSOVO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!--   -->
	<!--  ISO 4217 alpha 3 Currency Code 

The following disclaimer refers to all uses of the ISO currency code list in the CRS schema: For practical reasons, the list is based on the ISO 4217 Alpha 3 currency list which is currently used by banks and other financial institutions, and hence by tax administrations. The use of this list does not imply the expression by the OECD of any opinion whatsoever concerning the legal status of the territories listed. Its content is without prejudice to the status of or sovereignty over any territory, to the delimitation of international frontiers and boundaries and to the name of any territory, city or area.  
     -->
	<xsd:simpleType name="currCode_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">
			The appropriate currency code from the ISO 4217 three-byte alpha version for the currency in which a monetary amount is expressed. 
			</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="AED">
				<xsd:annotation>
					<xsd:documentation>UAE Dirham: UNITED ARAB EMIRATES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AFN">
				<xsd:annotation>
					<xsd:documentation>Afghani: AFGHANISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ALL">
				<xsd:annotation>
					<xsd:documentation>Lek: ALBANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AMD">
				<xsd:annotation>
					<xsd:documentation>Armenian Dram: ARMENIA	</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ANG">
				<xsd:annotation>
					<xsd:documentation>Netherlands Antillean Guilder: CURACAO; SINT MAARTEN (DUTCH PART)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AOA">
				<xsd:annotation>
					<xsd:documentation>Kwanza: ANGOLA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ARS">
				<xsd:annotation>
					<xsd:documentation>Argentine Peso: ARGENTINA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AUD">
				<xsd:annotation>
					<xsd:documentation>Australian Dollar: AUSTRALIA; CHRISTMAS ISLAND; COCOS (KEELING) ISLANDS; HEARD ISLAND AND McDONALD ISLANDS; KIRIBATI; NAURU; NORFOLK ISLAND; TUVALU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AWG">
				<xsd:annotation>
					<xsd:documentation>Aruban Florin: ARUBA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="AZN">
				<xsd:annotation>
					<xsd:documentation>Azerbaijan Manat: AZERBAIJAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BAM">
				<xsd:annotation>
					<xsd:documentation>Convertible Mark: BOSNIA AND HERZEGOVINA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BBD">
				<xsd:annotation>
					<xsd:documentation>Barbados Dollar: BARBADOS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BDT">
				<xsd:annotation>
					<xsd:documentation>Taka: BANGLADESH</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BGN">
				<xsd:annotation>
					<xsd:documentation>Bulgarian Lev: BULGARIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BHD">
				<xsd:annotation>
					<xsd:documentation>Bahraini Dinar: BAHRAIN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BIF">
				<xsd:annotation>
					<xsd:documentation>Burundi Franc: BURUNDI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BMD">
				<xsd:annotation>
					<xsd:documentation>Bermudian Dollar: BERMUDA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BND">
				<xsd:annotation>
					<xsd:documentation>Brunei Dollar: BRUNEI DARUSSALAM</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BOB">
				<xsd:annotation>
					<xsd:documentation>Boliviano: BOLIVIA, PLURINATIONAL STATE OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BOV">
				<xsd:annotation>
					<xsd:documentation>Mvdol: BOLIVIA, PLURINATIONAL STATE OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BRL">
				<xsd:annotation>
					<xsd:documentation>Brazilian Real: BRAZIL</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BSD">
				<xsd:annotation>
					<xsd:documentation>Bahamian Dollar: BAHAMAS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BTN">
				<xsd:annotation>
					<xsd:documentation>Ngultrum: BHUTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BWP">
				<xsd:annotation>
					<xsd:documentation>Pula: BOTSWANA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BYN">
				<xsd:annotation>
					<xsd:documentation>Belarusian Ruble: BELARUS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BYR">
				<xsd:annotation>
					<xsd:documentation>Historic use: Belarussian Ruble: BELARUS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="BZD">
				<xsd:annotation>
					<xsd:documentation>Belize Dollar: BELIZE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CAD">
				<xsd:annotation>
					<xsd:documentation>Canadian Dollar: CANADA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CDF">
				<xsd:annotation>
					<xsd:documentation>Congolese Franc: CONGO, THE DEMOCRATIC REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CHE">
				<xsd:annotation>
					<xsd:documentation>WIR Euro: SWITZERLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CHF">
				<xsd:annotation>
					<xsd:documentation>Swiss Franc: LIECHTENSTEIN; SWITZERLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CHW">
				<xsd:annotation>
					<xsd:documentation>WIR Franc: SWITZERLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CLF">
				<xsd:annotation>
					<xsd:documentation>Unidad de Fomento: CHILE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CLP">
				<xsd:annotation>
					<xsd:documentation>Chilean Peso: CHILE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CNY">
				<xsd:annotation>
					<xsd:documentation>Yuan Renminbi: CHINA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="COP">
				<xsd:annotation>
					<xsd:documentation>Colombian Peso: COLOMBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="COU">
				<xsd:annotation>
					<xsd:documentation>Unidad de Valor Real: COLOMBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CRC">
				<xsd:annotation>
					<xsd:documentation>Costa Rican Colon: COSTA RICA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CUC">
				<xsd:annotation>
					<xsd:documentation>Peso Convertible: CUBA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CUP">
				<xsd:annotation>
					<xsd:documentation>Cuban Peso: CUBA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CVE">
				<xsd:annotation>
					<xsd:documentation>Cabo Verde Escudo: CABO VERDE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="CZK">
				<xsd:annotation>
					<xsd:documentation>Czech Koruna: CZECHIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DJF">
				<xsd:annotation>
					<xsd:documentation>Djibouti Franc: DJIBOUTI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DKK">
				<xsd:annotation>
					<xsd:documentation>Danish Krone: DENMARK; FAROE ISLANDS; GREENLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DOP">
				<xsd:annotation>
					<xsd:documentation>Dominican Peso: DOMINICAN REPUBLIC</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="DZD">
				<xsd:annotation>
					<xsd:documentation>Algerian Dinar: ALGERIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="EGP">
				<xsd:annotation>
					<xsd:documentation>Egyptian Pound: EGYPT</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ERN">
				<xsd:annotation>
					<xsd:documentation>Nakfa: ERITREA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ETB">
				<xsd:annotation>
					<xsd:documentation>Ethiopian Birr: ETHIOPIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="EUR">
				<xsd:annotation>
					<xsd:documentation>Euro: ALAND ISLANDS; ANDORRA; AUSTRIA; BELGIUM; CYPRUS; ESTONIA; EUROPEAN UNION; FINLAND; FRANCE; FRENCH GUIANA; FRENCH SOUTHERN TERRITORIES; GERMANY; GREECE; GUADELOUPE; HOLY SEE (VATICAN CITY STATE); IRELAND; ITALY; LATVIA; LITHUANIA; LUXEMBOURG; MALTA; MARTINIQUE; MAYOTTE; MONACO; MONTENEGRO; NETHERLANDS; PORTUGAL; REUNION; SAINT BARTHELEMY; SAINT MARTIN (FRENCH PART); SAINT PIERRE AND MIQUELON; SAN MARINO; SLOVAKIA; SLOVENIA; SPAIN; Vatican City State (HOLY SEE)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FJD">
				<xsd:annotation>
					<xsd:documentation>Fiji Dollar: FIJI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="FKP">
				<xsd:annotation>
					<xsd:documentation>Falkland Islands Pound: FALKLAND ISLANDS (MALVINAS)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GBP">
				<xsd:annotation>
					<xsd:documentation>Pound Sterling: GUERNSEY; ISLE OF MAN; JERSEY; UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GEL">
				<xsd:annotation>
					<xsd:documentation>Lari: GEORGIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GHS">
				<xsd:annotation>
					<xsd:documentation>Ghana Cedi: GHANA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GIP">
				<xsd:annotation>
					<xsd:documentation>Gibraltar Pound: GIBRALTAR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GMD">
				<xsd:annotation>
					<xsd:documentation>Dalasi: GAMBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GNF">
				<xsd:annotation>
					<xsd:documentation>Guinean Franc: GUINEA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GTQ">
				<xsd:annotation>
					<xsd:documentation>Quetzal: GUATEMALA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="GYD">
				<xsd:annotation>
					<xsd:documentation>Guyana Dollar: GUYANA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HKD">
				<xsd:annotation>
					<xsd:documentation>Hong Kong Dollar: HONG KONG</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HNL">
				<xsd:annotation>
					<xsd:documentation>Lempira: HONDURAS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HRK">
				<xsd:annotation>
					<xsd:documentation>Kuna: CROATIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HTG">
				<xsd:annotation>
					<xsd:documentation>Gourde: HAITI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="HUF">
				<xsd:annotation>
					<xsd:documentation>Forint: HUNGARY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IDR">
				<xsd:annotation>
					<xsd:documentation>Rupiah: INDONESIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ILS">
				<xsd:annotation>
					<xsd:documentation>New Israeli Sheqel: ISRAEL</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="INR">
				<xsd:annotation>
					<xsd:documentation>Indian Rupee: BHUTAN; INDIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IQD">
				<xsd:annotation>
					<xsd:documentation>Iraqi Dinar: IRAQ</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="IRR">
				<xsd:annotation>
					<xsd:documentation>Iranian Rial: IRAN, ISLAMIC REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ISK">
				<xsd:annotation>
					<xsd:documentation>Iceland Krona: ICELAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="JMD">
				<xsd:annotation>
					<xsd:documentation>Jamaican Dollar: JAMAICA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="JOD">
				<xsd:annotation>
					<xsd:documentation>Jordanian Dinar: JORDAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="JPY">
				<xsd:annotation>
					<xsd:documentation>Yen: JAPAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KES">
				<xsd:annotation>
					<xsd:documentation>Kenyan Shilling: KENYA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KGS">
				<xsd:annotation>
					<xsd:documentation>Som: KYRGYZSTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KHR">
				<xsd:annotation>
					<xsd:documentation>Riel: CAMBODIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KMF">
				<xsd:annotation>
					<xsd:documentation>Comorian Franc : COMOROS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KPW">
				<xsd:annotation>
					<xsd:documentation>North Korean Won: KOREA, DEMOCRATIC PEOPLE’S REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KRW">
				<xsd:annotation>
					<xsd:documentation>Won: KOREA, REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KWD">
				<xsd:annotation>
					<xsd:documentation>Kuwaiti Dinar: KUWAIT</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KYD">
				<xsd:annotation>
					<xsd:documentation>Cayman Islands Dollar: CAYMAN ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="KZT">
				<xsd:annotation>
					<xsd:documentation>Tenge: KAZAKHSTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LAK">
				<xsd:annotation>
					<xsd:documentation>Lao Kip: LAO PEOPLE’S DEMOCRATIC REPUBLIC</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LBP">
				<xsd:annotation>
					<xsd:documentation>Lebanese Pound: LEBANON</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LKR">
				<xsd:annotation>
					<xsd:documentation>Sri Lanka Rupee: SRI LANKA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LRD">
				<xsd:annotation>
					<xsd:documentation>Liberian Dollar: LIBERIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LSL">
				<xsd:annotation>
					<xsd:documentation>Loti: LESOTHO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LTL">
				<xsd:annotation>
					<xsd:documentation>Historic use: Lithuanian Litas: LITHUANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LVL">
				<xsd:annotation>
					<xsd:documentation>Historic use: Latvian Lats: LATVIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="LYD">
				<xsd:annotation>
					<xsd:documentation>Libyan Dinar: LIBYA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MAD">
				<xsd:annotation>
					<xsd:documentation>Moroccan Dirham: MOROCCO; WESTERN SAHARA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MDL">
				<xsd:annotation>
					<xsd:documentation>Moldovan Leu: MOLDOVA, REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MGA">
				<xsd:annotation>
					<xsd:documentation>Malagasy Ariary: MADAGASCAR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MKD">
				<xsd:annotation>
					<xsd:documentation>Denar: MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MMK">
				<xsd:annotation>
					<xsd:documentation>Kyat: MYANMAR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MNT">
				<xsd:annotation>
					<xsd:documentation>Tugrik: MONGOLIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MOP">
				<xsd:annotation>
					<xsd:documentation>Pataca: MACAO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MRO">
				<xsd:annotation>
					<xsd:documentation>Historic use: Ouguiya: MAURITANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MRU">
				<xsd:annotation>
					<xsd:documentation>Ouguiya: MAURITANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MUR">
				<xsd:annotation>
					<xsd:documentation>Mauritius Rupee: MAURITIUS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MVR">
				<xsd:annotation>
					<xsd:documentation>Rufiyaa: MALDIVES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MWK">
				<xsd:annotation>
					<xsd:documentation>Malawi Kwacha: MALAWI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MXN">
				<xsd:annotation>
					<xsd:documentation>Mexican Peso: MEXICO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MXV">
				<xsd:annotation>
					<xsd:documentation>Mexican Unidad de Inversion (UDI): MEXICO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MYR">
				<xsd:annotation>
					<xsd:documentation>Malaysian Ringgit: MALAYSIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="MZN">
				<xsd:annotation>
					<xsd:documentation>Mozambique Metical: MOZAMBIQUE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NAD">
				<xsd:annotation>
					<xsd:documentation>Namibia Dollar: NAMIBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NGN">
				<xsd:annotation>
					<xsd:documentation>Naira: NIGERIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NIO">
				<xsd:annotation>
					<xsd:documentation>Cordoba Oro: NICARAGUA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NOK">
				<xsd:annotation>
					<xsd:documentation>Norwegian Krone: BOUVET ISLAND; NORWAY; SVALBARD AND JAN MAYEN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NPR">
				<xsd:annotation>
					<xsd:documentation>Nepalese Rupee: NEPAL</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="NZD">
				<xsd:annotation>
					<xsd:documentation>New Zealand Dollar: COOK ISLANDS; NEW ZEALAND; NIUE; PITCAIRN; TOKELAU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OMR">
				<xsd:annotation>
					<xsd:documentation>Rial Omani: OMAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PAB">
				<xsd:annotation>
					<xsd:documentation>Balboa: PANAMA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PEN">
				<xsd:annotation>
					<xsd:documentation>Sol: PERU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PGK">
				<xsd:annotation>
					<xsd:documentation>Kina: PAPUA NEW GUINEA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PHP">
				<xsd:annotation>
					<xsd:documentation>Philippine Peso: PHILIPPINES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PKR">
				<xsd:annotation>
					<xsd:documentation>Pakistan Rupee: PAKISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PLN">
				<xsd:annotation>
					<xsd:documentation>Zloty: POLAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="PYG">
				<xsd:annotation>
					<xsd:documentation>Guarani: PARAGUAY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="QAR">
				<xsd:annotation>
					<xsd:documentation>Qatari Rial: QATAR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RON">
				<xsd:annotation>
					<xsd:documentation>Romanian Leu: ROMANIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RSD">
				<xsd:annotation>
					<xsd:documentation>Serbian Dinar: SERBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RUB">
				<xsd:annotation>
					<xsd:documentation>Russian Ruble: RUSSIAN FEDERATION</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="RWF">
				<xsd:annotation>
					<xsd:documentation>Rwanda Franc: RWANDA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SAR">
				<xsd:annotation>
					<xsd:documentation>Saudi Riyal: SAUDI ARABIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SBD">
				<xsd:annotation>
					<xsd:documentation>Solomon Islands Dollar: SOLOMON ISLANDS</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SCR">
				<xsd:annotation>
					<xsd:documentation>Seychelles Rupee: SEYCHELLES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SDG">
				<xsd:annotation>
					<xsd:documentation>Sudanese Pound: SUDAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SEK">
				<xsd:annotation>
					<xsd:documentation>Swedish Krona: SWEDEN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SGD">
				<xsd:annotation>
					<xsd:documentation>Singapore Dollar: SINGAPORE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SHP">
				<xsd:annotation>
					<xsd:documentation>Saint Helena Pound: SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SLL">
				<xsd:annotation>
					<xsd:documentation>Leone: SIERRA LEONE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SOS">
				<xsd:annotation>
					<xsd:documentation>Somali Shilling: SOMALIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SRD">
				<xsd:annotation>
					<xsd:documentation>Surinam Dollar: SURINAME</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SSP">
				<xsd:annotation>
					<xsd:documentation>South Sudanese Pound: SOUTH SUDAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="STD">
				<xsd:annotation>
					<xsd:documentation>Historic use: Dobra: SAO TOME AND PRINCIPE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="STN">
				<xsd:annotation>
					<xsd:documentation>Dobra: SAO TOME AND PRINCIPE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SVC">
				<xsd:annotation>
					<xsd:documentation>El Salvador Colon: EL SALVADOR</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SYP">
				<xsd:annotation>
					<xsd:documentation>Syrian Pound: SYRIAN ARAB REPUBLIC</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="SZL">
				<xsd:annotation>
					<xsd:documentation>Lilangeni: ESWATINI</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="THB">
				<xsd:annotation>
					<xsd:documentation>Baht: THAILAND</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TJS">
				<xsd:annotation>
					<xsd:documentation>Somoni: TAJIKISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TMT">
				<xsd:annotation>
					<xsd:documentation>Turkmenistan New Manat: TURKMENISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TND">
				<xsd:annotation>
					<xsd:documentation>Tunisian Dinar: TUNISIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TOP">
				<xsd:annotation>
					<xsd:documentation>Pa’anga: TONGA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TRY">
				<xsd:annotation>
					<xsd:documentation>Turkish Lira: TURKEY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TTD">
				<xsd:annotation>
					<xsd:documentation>Trinidad and Tobago Dollar: TRINIDAD AND TOBAGO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TWD">
				<xsd:annotation>
					<xsd:documentation>New Taiwan Dollar: TAIWAN, PROVINCE OF CHINA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="TZS">
				<xsd:annotation>
					<xsd:documentation>Tanzanian Shilling: TANZANIA, UNITED REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UAH">
				<xsd:annotation>
					<xsd:documentation>Hryvnia: UKRAINE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UGX">
				<xsd:annotation>
					<xsd:documentation>Uganda Shilling: UGANDA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="USD">
				<xsd:annotation>
					<xsd:documentation>US Dollar: AMERICAN SAMOA; BONAIRE; SINT EUSTATIUS AND SABA; BRITISH INDIAN OCEAN TERRITORY; ECUADOR; EL SALVADOR; GUAM; HAITI; MARSHALL ISLANDS; MICRONESIA, FEDERATED STATES OF; NORTHERN MARIANA ISLANDS; PALAU; PANAMA; PUERTO RICO; TIMOR-LESTE; TURKS AND CAICOS ISLANDS; UNITED STATES; UNITED STATES MINOR OUTLYING ISLANDS; VIRGIN ISLANDS (BRITISH); VIRGIN ISLANDS (US)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="USN">
				<xsd:annotation>
					<xsd:documentation>US Dollar (Next day): UNITED STATES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="USS">
				<xsd:annotation>
					<xsd:documentation>Historic use: US Dollar (Same day): UNITED STATES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UYI">
				<xsd:annotation>
					<xsd:documentation>Uruguay Peso en Unidades Indexadas (UI): URUGUAY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UYU">
				<xsd:annotation>
					<xsd:documentation>Peso Uruguayo: URUGUAY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UYW">
				<xsd:annotation>
					<xsd:documentation>Unidad Previsional: URUGUAY</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="UZS">
				<xsd:annotation>
					<xsd:documentation>Uzbekistan Sum: UZBEKISTAN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VEF">
				<xsd:annotation>
					<xsd:documentation>Historic use: Bolivar: VENEZUELA, BOLIVARIAN REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VES">
				<xsd:annotation>
					<xsd:documentation>Bolívar Soberano: VENEZUELA, BOLIVARIAN REPUBLIC OF</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VND">
				<xsd:annotation>
					<xsd:documentation>Dong: VIET NAM</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="VUV">
				<xsd:annotation>
					<xsd:documentation>Vatu: VANUATU</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="WST">
				<xsd:annotation>
					<xsd:documentation>Tala: SAMOA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XAF">
				<xsd:annotation>
					<xsd:documentation>CFA Franc BEAC: CAMEROON; CENTRAL AFRICAN REPUBLIC; CHAD; CONGO; EQUATORIAL GUINEA; GABON</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XAG">
				<xsd:annotation>
					<xsd:documentation>Silver: ZZ11_Silver</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XAU">
				<xsd:annotation>
					<xsd:documentation>Gold: ZZ08_Gold</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XBA">
				<xsd:annotation>
					<xsd:documentation>Bond Markets Unit European Composite Unit (EURCO):  ZZ01_Bond Markets Unit European_EURCO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XBB">
				<xsd:annotation>
					<xsd:documentation>Bond Markets Unit European Monetary Unit (E.M.U.-6): ZZ02_Bond Markets Unit European_EMU-6</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XBC">
				<xsd:annotation>
					<xsd:documentation>Bond Markets Unit European Unit of Account 9 (E.U.A.-9): ZZ03_Bond Markets Unit European_EUA-9</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XBD">
				<xsd:annotation>
					<xsd:documentation>Bond Markets Unit European Unit of Account 17 (E.U.A.-17): ZZ04_Bond Markets Unit European_EUA-17</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XCD">
				<xsd:annotation>
					<xsd:documentation>East Caribbean Dollar: ANGUILLA; ANTIGUA AND BARBUDA; DOMINICA; GRENADA; MONTSERRAT; SAINT KITTS AND NEVIS; SAINT LUCIA; SAINT VINCENT AND THE GRENADINES</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XDR">
				<xsd:annotation>
					<xsd:documentation>SDR (Special Drawing Right): INTERNATIONAL MONETARY FUND (IMF)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XFU">
				<xsd:annotation>
					<xsd:documentation>Historic use: UIC-Franc: ZZ05_UIC-Franc</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XOF">
				<xsd:annotation>
					<xsd:documentation>CFA Franc BCEAO: BENIN; BURKINA FASO; COTE D'IVOIRE; GUINEA-BISSAU; MALI; NIGER; SENEGAL; TOGO</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XPD">
				<xsd:annotation>
					<xsd:documentation>Palladium: ZZ09_Palladium</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XPF">
				<xsd:annotation>
					<xsd:documentation>CFP Franc: FRENCH POLYNESIA; NEW CALEDONIA; WALLIS AND FUTUNA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XPT">
				<xsd:annotation>
					<xsd:documentation>Platinum: ZZ10_Platinum</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XSU">
				<xsd:annotation>
					<xsd:documentation>Sucre: SISTEMA UNITARIO DE COMPENSACION REGIONAL DE PAGOS "SUCRE"</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XUA">
				<xsd:annotation>
					<xsd:documentation>ADB Unit of Account: MEMBER COUNTRIES OF THE AFRICAN DEVELOPMENT BANK GROUP</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="XXX">
				<xsd:annotation>
					<xsd:documentation>The codes assigned for transactions where no currency is involved: ZZ07_No_Currency</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="YER">
				<xsd:annotation>
					<xsd:documentation>Yemeni Rial: YEMEN</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ZAR">
				<xsd:annotation>
					<xsd:documentation>Rand: LESOTHO; NAMIBIA; SOUTH AFRICA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ZMW">
				<xsd:annotation>
					<xsd:documentation>Zambian Kwacha: ZAMBIA</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="ZWL">
				<xsd:annotation>
					<xsd:documentation>Zimbabwe Dollar: ZIMBABWE</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
</xsd:schema>
`,
  'oecdcrstypes_v5.0.xsd': `
<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSpy v2012 rel. 2 sp1 (x64) (http://www.altova.com) by Sebastien Michon (OECD) -->
<xsd:schema xmlns:stf="urn:oecd:ties:crsstf:v5" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:oecd:ties:crsstf:v5" elementFormDefault="qualified" attributeFormDefault="unqualified" version="5.0">
	<!-- -->
	<!--+++++++++++++++++++++++  String lenght types ++++++++++++++++++++++++++++++++++++++ -->
	<!-- -->
	<!-- Defines a string with minimum length 1 and maximum length of 10 -->
	<xsd:simpleType name="StringMin1Max10_Type">
		<xsd:annotation>
			<xsd:documentation>Defines a string with minimum length 1 and maximum length of 10</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:minLength value="1"/>
			<xsd:maxLength value="10"/>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!-- Defines a string with minimum length 1 and maximum length of 170 -->
	<xsd:simpleType name="StringMin1Max170_Type">
		<xsd:annotation>
			<xsd:documentation>Defines a string with minimum length 1 and maximum length of 170</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:minLength value="1"/>
			<xsd:maxLength value="170"/>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!-- Defines a string with minimum length 1 and maximum length of 200 -->
	<xsd:simpleType name="StringMin1Max200_Type">
		<xsd:annotation>
			<xsd:documentation>Defines a string with minimum length 1 and maximum length of 200</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:minLength value="1"/>
			<xsd:maxLength value="200"/>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!-- Defines a string with minimum length 1 and maximum length of 400 -->
	<xsd:simpleType name="StringMin1Max400_Type">
		<xsd:annotation>
			<xsd:documentation>Defines a string with minimum length 1 and maximum length of 400</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:minLength value="1"/>
			<xsd:maxLength value="400"/>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!-- Defines a string with minimum length 1 and maximum length of 4000 -->
	<xsd:simpleType name="StringMin1Max4000_Type">
		<xsd:annotation>
			<xsd:documentation>Defines a string with minimum length 1 and maximum length of 4000</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:minLength value="1"/>
			<xsd:maxLength value="4000"/>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!--+++++++++++++++++++++++  Reusable Simple types ++++++++++++++++++++++++++++++++++++++ -->
	<!-- Document type indicators types -->
	<xsd:simpleType name="OECDDocTypeIndic_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">This element specifies the type of data being submitted.</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="OECD0">
				<xsd:annotation>
					<xsd:documentation>Resend Data</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD1">
				<xsd:annotation>
					<xsd:documentation>New Data</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD2">
				<xsd:annotation>
					<xsd:documentation>Corrected Data</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD3">
				<xsd:annotation>
					<xsd:documentation>Deletion of Data</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD10">
				<xsd:annotation>
					<xsd:documentation>Resend Test Data</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD11">
				<xsd:annotation>
					<xsd:documentation>New Test Data</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD12">
				<xsd:annotation>
					<xsd:documentation>Corrected Test Data</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD13">
				<xsd:annotation>
					<xsd:documentation>Deletion of Test Data</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!-- Kind of Name -->
	<xsd:simpleType name="OECDNameType_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">
				It is possible for stf documents to contain several names for the same party. This is a qualifier to indicate the type of a particular name. Such types include nicknames ('nick'), names under which a party does business ('dba' a short name for the entity, or a name that is used for public acquaintance instead of the official business name) etc.
			</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:string">
			<xsd:enumeration value="OECD201">
				<xsd:annotation>
					<xsd:documentation>SMFAliasOrOther</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD202">
				<xsd:annotation>
					<xsd:documentation>indiv (individual)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD203">
				<xsd:annotation>
					<xsd:documentation>alias (alias)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD204">
				<xsd:annotation>
					<xsd:documentation>nick (nickname)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD205">
				<xsd:annotation>
					<xsd:documentation>aka (also known as)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD206">
				<xsd:annotation>
					<xsd:documentation>dba (doing business as)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD207">
				<xsd:annotation>
					<xsd:documentation>legal (legal name)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD208">
				<xsd:annotation>
					<xsd:documentation>atbirth (name at birth)</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!-- Type of the address considered from a legal point of view -->
	<xsd:simpleType name="OECDLegalAddressType_EnumType">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">This is a datatype for an attribute to an address. It serves to indicate the legal character of that address (residential, business etc.)</xsd:documentation>
		</xsd:annotation>
		<xsd:restriction base="xsd:token">
			<xsd:enumeration value="OECD301">
				<xsd:annotation>
					<xsd:documentation>residentialOrBusiness</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD302">
				<xsd:annotation>
					<xsd:documentation>residential</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD303">
				<xsd:annotation>
					<xsd:documentation>business</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD304">
				<xsd:annotation>
					<xsd:documentation>registeredOffice</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
			<xsd:enumeration value="OECD305">
				<xsd:annotation>
					<xsd:documentation>unspecified</xsd:documentation>
				</xsd:annotation>
			</xsd:enumeration>
		</xsd:restriction>
	</xsd:simpleType>
	<!-- -->
	<!--++++++++++++++++++ Reusable Complex types +++++++++++++++++++++++++++++++++++++ -->
	<!-- -->
	<!-- Document specification: Data identifying and describing the document -->
	<xsd:complexType name="DocSpec_Type">
		<xsd:annotation>
			<xsd:documentation xml:lang="en">Document specification: Data identifying and describing the document, where
'document' here means the part of a message that is to transmit the data about a single block of CRS information. </xsd:documentation>
		</xsd:annotation>
		<xsd:sequence>
			<xsd:element name="DocTypeIndic" type="stf:OECDDocTypeIndic_EnumType"/>
			<xsd:element name="DocRefId" type="stf:StringMin1Max200_Type">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Sender's unique identifier of this document </xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="CorrMessageRefId" type="stf:StringMin1Max170_Type" minOccurs="0">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Reference id of the message of the document referred to if this is a correction</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
			<xsd:element name="CorrDocRefId" type="stf:StringMin1Max200_Type" minOccurs="0">
				<xsd:annotation>
					<xsd:documentation xml:lang="en">Reference id of the document referred to if this is correction</xsd:documentation>
				</xsd:annotation>
			</xsd:element>
		</xsd:sequence>
	</xsd:complexType>
	<!-- -->
</xsd:schema>
`,
};
