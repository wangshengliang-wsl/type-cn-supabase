import * as dotenv from 'dotenv';

// 加载 .env.local 文件
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { lessons, lessonItems } from './schema';
import lessonsData from '@/docs/lessons.json';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // 清空现有数据（可选）
    console.log('📝 Clearing existing data...');
    await db.delete(lessonItems);
    await db.delete(lessons);

    // 插入课程数据
    console.log('📚 Inserting lessons...');
    for (const lesson of lessonsData) {
      await db.insert(lessons).values({
        lessonId: lesson.lesson_id,
        titleEn: lesson.title_en,
        titleZh: lesson.title_zh,
        descriptionEn: lesson.description_en,
        cover: lesson.cover,
        tag: lesson.tag,
        order: lesson.order,
      });

      // 插入课程项目
      console.log(`  - Inserting items for ${lesson.title_en}...`);
      for (let i = 0; i < lesson.items.length; i++) {
        const item = lesson.items[i];
        await db.insert(lessonItems).values({
          itemId: item.item_id,
          lessonId: lesson.lesson_id,
          type: item.type,
          en: item.en,
          zh: item.zh,
          py: item.py,
          accepted: item.accepted,
          audio: item.audio,
          order: i,
        });
      }
    }

    console.log('✅ Seeding completed successfully!');
    console.log(`📊 Inserted ${lessonsData.length} lessons`);
    const totalItems = lessonsData.reduce((sum, lesson) => sum + lesson.items.length, 0);
    console.log(`📊 Inserted ${totalItems} items`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });

