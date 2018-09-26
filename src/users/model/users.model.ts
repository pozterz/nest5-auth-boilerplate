import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique, AllowNull } from 'sequelize-typescript'

import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

@Table({
	timestamps: true,
	paranoid: true
})
export class Users extends Model<Users> {
	@ApiModelProperty()
	@PrimaryKey
	@AutoIncrement
	@Column
	user_id: number

	@ApiModelProperty()
	@AllowNull(false)
	@Unique
	@Column
	username: string

  @Exclude()
	@ApiModelPropertyOptional()
	@AllowNull(false)
	@Column
	password: string

	@ApiModelPropertyOptional()
	@AllowNull(false)
	@Unique
	@Column
	email: string

	@ApiModelPropertyOptional()
	@AllowNull(false)
	@Column
	name: string

	@ApiModelProperty()
	@Column
	image: string

	@ApiModelProperty()
	@Column
	resetPasswordToken: string

	@ApiModelProperty()
	@Column({ type: DataType.DATE })
	resetPasswordExpires: string

  hasKey = key => {
		return key in this
	}
}
