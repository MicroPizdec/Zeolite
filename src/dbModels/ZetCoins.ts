import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table
export default class ZetCoins extends Model {
  @Column(DataType.STRING)
  guildID: string;

  @Column(DataType.STRING)
  userID: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  balance: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  depositBal: number;
}
