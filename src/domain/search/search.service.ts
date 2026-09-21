import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity';
import { SubSectionEntity } from '../sub-section/sub-section.entity';
import { TopicEntity } from '../topic/topic.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';
import { TrainingProgramEntity } from '../training-program/training-program.entity';
import { WebinarEntity } from '../webinar/webinar.entity';
import { FacultyEntity } from '../faculty/faculty.entity';
import { ConditionEntity } from '../condition/condition.entity';
import { PatientContentEntity } from '../patient-content/patient-content.entity';

// Plain ILIKE won't connect "HCC" to content titled "Hepatocellular
// Carcinoma" since they share no text — mirrors the same list used
// client-side (tisl_frontend/src/lib/utils/search-synonyms.js) so both
// directions match regardless of which layer ends up doing the matching.
const SYNONYM_PAIRS: [string, string][] = [
  ['HCC', 'Hepatocellular Carcinoma'],
  ['GAE', 'Genicular Artery Embolization'],
  ['PAE', 'Prostatic Artery Embolization'],
  ['UFE', 'Uterine Fibroid Embolization'],
  ['PCI', 'Percutaneous Coronary Intervention'],
  ['ACS', 'Acute Coronary Syndrome'],
  ['STEMI', 'ST-Elevation Myocardial Infarction'],
  ['CTO', 'Chronic Total Occlusion'],
  ['TAVI', 'Transcatheter Aortic Valve Implantation'],
  ['ECMO', 'Extracorporeal Membrane Oxygenation'],
  ['CPB', 'Cardiopulmonary Bypass'],
  ['PAD', 'Peripheral Artery Disease'],
  ['EVT', 'Endovascular Therapy'],
  ['CLTI', 'Chronic Limb-Threatening Ischaemia'],
  ['IFU', 'Instructions For Use'],
];

function expandQuery(q: string): string[] {
  const lower = q.trim().toLowerCase();
  if (!lower) return [];
  const forms = new Set<string>([lower]);
  for (const [abbr, full] of SYNONYM_PAIRS) {
    const a = abbr.toLowerCase();
    const f = full.toLowerCase();
    if (a === lower) forms.add(f);
    if (f === lower) forms.add(a);
    if (f.includes(lower) || lower.includes(f)) forms.add(a);
  }
  return [...forms];
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(TherapyAreaEntity) private readonly taRepo: Repository<TherapyAreaEntity>,
    @InjectRepository(SubSectionEntity) private readonly ssRepo: Repository<SubSectionEntity>,
    @InjectRepository(TopicEntity) private readonly topicRepo: Repository<TopicEntity>,
    @InjectRepository(ContentItemEntity) private readonly contentRepo: Repository<ContentItemEntity>,
    @InjectRepository(TrainingProgramEntity) private readonly trainingProgramRepo: Repository<TrainingProgramEntity>,
    @InjectRepository(WebinarEntity) private readonly webinarRepo: Repository<WebinarEntity>,
    @InjectRepository(FacultyEntity) private readonly facultyRepo: Repository<FacultyEntity>,
    @InjectRepository(ConditionEntity) private readonly conditionRepo: Repository<ConditionEntity>,
    @InjectRepository(PatientContentEntity) private readonly patientContentRepo: Repository<PatientContentEntity>,
  ) {}

  async search(q: string) {
    const terms = expandQuery(q);
    if (terms.length === 0) {
      return {
        therapyAreas: [],
        subSections: [],
        topics: [],
        contentItems: [],
        trainingPrograms: [],
        webinars: [],
        faculty: [],
        conditions: [],
        patientContent: [],
      };
    }
    const likeTerms = terms.map((t) => `%${t}%`);

    const therapyAreas = await this.taRepo
      .createQueryBuilder('ta')
      .where('ta.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`ta.name ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`ta.description ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(10)
      .getMany();

    const subSections = await this.ssRepo
      .createQueryBuilder('ss')
      .leftJoinAndSelect('ss.therapyArea', 'ta')
      .where('ss.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`ss.name ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`ss.description ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(10)
      .getMany();

    const topics = await this.topicRepo
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.subSection', 'ss')
      .leftJoinAndSelect('ss.therapyArea', 'ta')
      .where('topic.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`topic.name ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`topic.description ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(15)
      .getMany();

    const contentItems = await this.contentRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.topic', 'topic')
      .leftJoinAndSelect('topic.subSection', 'ss')
      .leftJoinAndSelect('ss.therapyArea', 'ta')
      .where('item.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`item.title ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`item.description ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`item.content_data::text ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(20)
      .getMany();

    const trainingPrograms = await this.trainingProgramRepo
      .createQueryBuilder('program')
      .where('program.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`program.title ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`program.description ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`program.what_it_covers ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`program.designed_for ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(10)
      .getMany();

    const webinars = await this.webinarRepo
      .createQueryBuilder('webinar')
      .leftJoinAndSelect('webinar.faculty', 'faculty')
      .where('webinar.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`webinar.title ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`webinar.description ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(10)
      .getMany();

    const faculty = await this.facultyRepo
      .createQueryBuilder('faculty')
      .where('faculty.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`faculty.name ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`faculty.designation ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`faculty.hospital ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`faculty.bio ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(10)
      .getMany();

    const conditions = await this.conditionRepo
      .createQueryBuilder('condition')
      .where('condition.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`condition.name ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`condition.description ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(10)
      .getMany();

    const patientContent = await this.patientContentRepo
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.condition', 'condition')
      .where('content.is_active = true')
      .andWhere(
        new Brackets((sub) => {
          likeTerms.forEach((term, i) => {
            sub.orWhere(`content.title ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`content.description ILIKE :t${i}`, { [`t${i}`]: term });
            sub.orWhere(`content.content_data::text ILIKE :t${i}`, { [`t${i}`]: term });
          });
        }),
      )
      .take(15)
      .getMany();

    return {
      therapyAreas: therapyAreas.map((ta) => ({ id: ta.id, name: ta.name, slug: ta.slug, code: ta.code })),
      subSections: subSections.map((ss) => ({
        id: ss.id,
        name: ss.name,
        slug: ss.slug,
        taName: ss.therapyArea?.name,
        taSlug: ss.therapyArea?.slug,
      })),
      topics: topics.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        subSectionName: t.subSection?.name,
        taSlug: t.subSection?.therapyArea?.slug,
      })),
      contentItems: contentItems.map((c) => ({
        id: c.id,
        title: c.title,
        contentType: c.contentType,
        topicName: c.topic?.name,
        topicSlug: c.topic?.slug,
        taSlug: c.topic?.subSection?.therapyArea?.slug,
      })),
      trainingPrograms: trainingPrograms.map((p) => ({
        id: p.id,
        title: p.title,
        therapyArea: p.therapyArea,
        programType: p.programType,
      })),
      webinars: webinars.map((w) => ({
        id: w.id,
        title: w.title,
        scheduledAt: w.scheduledAt,
        facultyNames: (w.faculty ?? []).map((f) => f.name).join(', '),
      })),
      faculty: faculty.map((f) => ({
        id: f.id,
        name: f.name,
        designation: f.designation,
        hospital: f.hospital,
      })),
      conditions: conditions.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      patientContent: patientContent.map((c) => ({
        id: c.id,
        title: c.title,
        contentType: c.contentType,
        conditionName: c.condition?.name,
        conditionSlug: c.condition?.slug,
      })),
    };
  }
}
