import { Ability, AbilityBuilder } from '@casl/ability'
import { permissions } from './permissions'
import { User } from './models/user';
import { userSubject } from './subjects/user'
import { projectSubject } from './subjects/project'
import { organizetionSubject } from './subjects/project'
import { inviteSubject } from './subjects/project'
import { billingSubject } from './subjects/project'

import z from 'zod';

export * from './models/organization'
export * from './models/project'
export * from './models/user'

const appAbilitySchema = z.union([
  projectSubject,
  userSubject,
  organizetionSubject,
  inviteSubject,
  billingSubject,

  z.tuple([
    z.literal('manage'),
    z.literal('all')
  ])
])
type AppAbilities = z.infer<typeof appAbilitySchema>
  
export type AppAbility = Ability<AppAbilities>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder<AppAbility>(Ability);

  if (typeof permissions[user.role] != 'function') {
    throw new Error(`Permissions for role ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    }
  })

  return ability
}
