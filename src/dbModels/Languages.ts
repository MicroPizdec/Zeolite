import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table
export default class Languages extends Model {
  @Column(DataType.STRING)
  userID: string;

  @Column(DataType.STRING)
  language: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  langChanged: boolean;
}
