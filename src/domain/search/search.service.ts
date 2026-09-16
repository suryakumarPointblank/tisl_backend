import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity';
import { SubSectionEntity } from '../sub-section/sub-section.entity';
import { TopicEntity } from '../topic/topic.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';

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
  ) {}

  async search(q: string) {
    const terms = expandQuery(q);
    if (terms.length === 0) {
      return { therapyAreas: [], subSections: [], topics: [], contentItems: [] };
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
    };
  }
}
