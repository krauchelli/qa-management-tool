import prisma from '../utils/prisma';
import { CreateTagDto, UpdateTagDto } from '../types';

export class TagService {
  /**
   * Get all tags
   */
  async getAllTags() {
    const tags = await prisma.tag.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: { tests: true }
        }
      }
    });

    return tags.map(tag => ({
      ...tag,
      usageCount: tag._count.tests
    }));
  }

  /**
   * Get tag by ID
   */
  async getTagById(id: string) {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tests: true }
        }
      }
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    return {
      ...tag,
      usageCount: tag._count.tests
    };
  }

  /**
   * Create new tag
   */
  async createTag(data: CreateTagDto) {
    // Check if tag name already exists
    const existing = await prisma.tag.findUnique({
      where: { name: data.name }
    });

    if (existing) {
      throw new Error(`Tag with name "${data.name}" already exists`);
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        color: data.color || '#3B82F6',
        category: data.category
      }
    });

    return tag;
  }

  /**
   * Update tag
   */
  async updateTag(id: string, data: UpdateTagDto) {
    // Check if tag exists
    await this.getTagById(id);

    // If updating name, check for duplicates
    if (data.name) {
      const existing = await prisma.tag.findFirst({
        where: {
          name: data.name,
          NOT: { id }
        }
      });

      if (existing) {
        throw new Error(`Tag with name "${data.name}" already exists`);
      }
    }

    const tag = await prisma.tag.update({
      where: { id },
      data
    });

    return tag;
  }

  /**
   * Delete tag
   */
  async deleteTag(id: string) {
    // Check if tag exists
    await this.getTagById(id);

    await prisma.tag.delete({
      where: { id }
    });

    return { success: true, message: 'Tag deleted successfully' };
  }

  /**
   * Add tag to test
   */
  async addTagToTest(testId: string, tagId: string) {
    // Check if already exists
    const existing = await prisma.testTag.findFirst({
      where: { testId, tagId }
    });

    if (existing) {
      return existing;
    }

    const testTag = await prisma.testTag.create({
      data: { testId, tagId },
      include: { tag: true }
    });

    return testTag;
  }

  /**
   * Remove tag from test
   */
  async removeTagFromTest(testId: string, tagId: string) {
    const testTag = await prisma.testTag.findFirst({
      where: { testId, tagId }
    });

    if (!testTag) {
      throw new Error('Tag not found on test');
    }

    await prisma.testTag.delete({
      where: { id: testTag.id }
    });

    return { success: true, message: 'Tag removed from test' };
  }

  /**
   * Get tags for a test
   */
  async getTestTags(testId: string) {
    const testTags = await prisma.testTag.findMany({
      where: { testId },
      include: { tag: true }
    });

    return testTags.map(tt => tt.tag);
  }
}

export default new TagService();
