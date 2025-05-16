import { UserRole } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(userRepository) {
  const adminEmail = 'admin@example.com';
  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('AdminPassword123!', saltRounds);
    const adminUser = userRepository.create({
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
    });
    await userRepository.save(adminUser);
    console.log('Admin User created');
  }
}
