/**
 * Body areas for the "Learn" page. Each one points at an official
 * MedlinePlus health-topic group, verified against the live service.
 */
export interface BodyArea {
  id: string;
  label: string;
  kidLabel: string;
  group: string;
}

export const BODY_AREAS: BodyArea[] = [
  {
    id: "lungs",
    label: "Lungs & Breathing",
    kidLabel: "Breathing and lungs",
    group: "Lungs and Breathing",
  },
  {
    id: "heart",
    label: "Heart & Blood",
    kidLabel: "Heart and blood",
    group: "Blood, Heart and Circulation",
  },
  {
    id: "stomach",
    label: "Tummy & Digestion",
    kidLabel: "Tummy and digestion",
    group: "Digestive System",
  },
  {
    id: "skin",
    label: "Skin, Hair & Nails",
    kidLabel: "Skin, hair and nails",
    group: "Skin, Hair and Nails",
  },
  {
    id: "head",
    label: "Head, Brain & Nerves",
    kidLabel: "Head, brain and nerves",
    group: "Brain and Nerves",
  },
  {
    id: "eyes",
    label: "Eyes & Vision",
    kidLabel: "Eyes and seeing",
    group: "Eyes and Vision",
  },
  {
    id: "mouth",
    label: "Mouth, Nose & Throat",
    kidLabel: "Mouth, nose and throat",
    group: "Ear, Nose and Throat",
  },
  {
    id: "bones",
    label: "Bones, Joints & Muscles",
    kidLabel: "Bones, joints and muscles",
    group: "Bones, Joints and Muscles",
  },
  {
    id: "kidneys",
    label: "Kidneys & Urine",
    kidLabel: "Kidneys and pee",
    group: "Kidneys and Urinary System",
  },
  {
    id: "hormones",
    label: "Sugar & Hormones",
    kidLabel: "Sugar and hormones",
    group: "Endocrine System",
  },
  {
    id: "mental",
    label: "Feelings & Mind",
    kidLabel: "Feelings and mind",
    group: "Mental Health and Behavior",
  },
  {
    id: "allergy",
    label: "Allergies & Germs",
    kidLabel: "Allergies and germs",
    group: "Immune System",
  },
  {
    id: "infections",
    label: "Infections",
    kidLabel: "Germs and infections",
    group: "Infections",
  },
  {
    id: "injuries",
    label: "Injuries & Wounds",
    kidLabel: "Cuts and injuries",
    group: "Injuries and Wounds",
  },
  {
    id: "symptoms",
    label: "Common Symptoms",
    kidLabel: "Common symptoms",
    group: "Symptoms",
  },
  {
    id: "sleep",
    label: "Sleep, Food & Moving",
    kidLabel: "Sleep, food and moving",
    group: "Wellness and Lifestyle",
  },
  {
    id: "medicines",
    label: "Medicines",
    kidLabel: "Medicines",
    group: "Drug Therapy",
  },
];

export function findArea(id: string | null): BodyArea | null {
  if (!id) return null;
  return BODY_AREAS.find((a) => a.id === id) ?? null;
}
