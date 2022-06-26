import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table
export default class Warns extends Model {
  @Column(DataType.STRING)
  guildID: string;

  @Column(DataType.STRING)
  userID: string;

  @Column(DataType.STRING)
  moderatorID: string;

  @Column(DataType.TEXT)
  reason: string;
}
