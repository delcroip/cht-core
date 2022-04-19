const Factory = require('rosie').Factory;
const Faker = require('@faker-js/faker');
const moment = require('moment');

module.exports = new Factory()
  .option('patient', '')
  .option('contact', '')
  .attr('inputs', ['patient'], (patient) => {
    const inputContact = {
      _id: patient._id,
      name: patient.name,
      date_of_birth: patient.date_of_birth,
      sex: patient.sex,
      parent: { _id: patient.parent._id }
    };
    const input = {
      meta: '',
      source: 'contact',
      source_id: '',
      contact: inputContact
    };
    return input;
  })
  .attr('family_name', ['contact'], (contact) => {
    return contact.name;
  })
  .attr('patient_contact_phone', ['contact'], (contact) => {
    return contact.phone;
  })
  .attr('patient_id', ['patient'], (patient) => {
    return patient._id;
  })
  .attr('patient_name', ['patient'], (patient) => {
    return patient.name;
  })
  .attr('patient_age_in_years', ['patient'], (patient) => {
    const ageInYears = moment().diff(patient.date_of_birth, 'years');
    return ageInYears;
  })
  .attr('patient_age_in_months', ['patient'], (patient) => {
    const ageInMonths = moment().diff(patient.date_of_birth, 'months');
    return ageInMonths;
  })
  .attr('patient_age_in_days', ['patient'], (patient) => {
    const ageInDays = moment().diff(patient.date_of_birth, 'days');
    return ageInDays;
  })
  .attr('group_followup_options', () => {
    const groupFollowupOptions = {
      follow_up_type: Faker.faker.random.arrayElement(['treat', 'treat_refer', 'refer_only']),
      follow_up_method: Faker.faker.random.arrayElement(['phone', 'in_person']),
    };
    return groupFollowupOptions;
  })
  .attr('group_danger_signs', ['group_followup_options'], (groupFollowupOptions) => {
    if (groupFollowupOptions.follow_up_type !== 'treat') {
      return null;
    }
    const groupDangerSigns = {
      danger_signs: Faker.faker.helpers.uniqueArray(
        ['convulsions', 'unable_to_feed', 'vomits_everything', 'very_sleepy', 'chest_indrawing'],
        Faker.faker.datatype.number({ min: 1, max: 5 }))
    };
    return groupDangerSigns;
  })
  .attr('group_improved',
    ['group_followup_options', 'group_danger_signs'],
    (groupFollowupOptions, groupDangerSigns) => {
      if (groupFollowupOptions.follow_up_type !== 'treat') {
        return null;
      }
if (!groupDangerSigns || !groupDangerSigns.danger_signs) {
      const groupImproved = {
        g_patient_treatment_outcome: Faker.faker.random.arrayElement(
          ['cured', 'still_recovering', 'bad_medicine_reaction', 'not_improving', 'died'])
      };
      return groupImproved;
    })
  .attr('group_referral_followup', ['group_followup_options'], (groupFollowupOptions) => {
    if (groupFollowupOptions.follow_up_type !== 'treat_refer' && groupFollowupOptions.follow_up_type !== 'refer_only') {
      return null;
    }
    const groupReferralFollowup = {
      g_patient_health_facility_visit: Faker.faker.random.arrayElement(['yes', 'no'])
    };
    return groupReferralFollowup;
  })
  .attr('group_better',
    ['group_followup_options', 'group_referral_followup'],
    (groupFollowupOptions, groupReferralFollowup) => {
      if (groupFollowupOptions.follow_up_type !== 'treat_refer'
        && groupFollowupOptions.follow_up_type !== 'refer_only') {
        return null;
      }
      if (groupReferralFollowup.g_patient_health_facility_visit === 'yes') {
        return null;
      }
      const groupBetter = {
        g_patient_better: Faker.faker.random.arrayElement(['cured', 'still_recovering', 'still_in_facility', 'died'])
      };
      return groupBetter;
    })
  .attr('referral_follow_up_needed',
    ['group_better', 'group_improved', 'group_danger_signs'],
    (groupBetter, groupImproved, groupDangerSigns) => {
 if ((groupBetter && groupBetter.g_patient_better === 'no') ||
(groupImproved && groupImproved.g_patient_treatment_outcome === 'bad_medicine_reaction') ||
        (groupImproved !== null && groupImproved.g_patient_treatment_outcome === 'not_improving') ||
(groupDangerSigns && groupDangerSigns.danger_signs)) {
        return true;
      }
      return false;
    })
  .attr('danger_signs', ['group_danger_signs'], (groupDangerSigns) => {
    if (groupDangerSigns !== null) {
      return groupDangerSigns.danger_signs;
    }
    return null;
  })
  .attr('patient_improved', ['group_improved'], (groupImproved) => {
    if ((groupImproved !== null && groupImproved.g_patient_treatment_outcome === 'still_recovering')
      || (groupImproved !== null && groupImproved.g_patient_treatment_outcome === 'cured')) {
      return 'yes';
    }
    return 'no';
  })
  .attr('patient_better', ['group_better'], (groupBetter) => {
    if (groupBetter !== null) {
      return groupBetter.g_patient_better;
    }
    return null;
  })
  .attr('patient_health_facility_visit', ['group_better'], (groupBetter) => {
    if (groupBetter !== null) {
      return groupBetter.g_patient_health_facility_visit;
    }
    return null;
  });
